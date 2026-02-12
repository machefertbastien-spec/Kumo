type KumoRole = 'user' | 'assistant';

export interface KumoMessage {
  role: KumoRole;
  content: string;
}

const OPENAI_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_MODEL = 'gpt-4.1-mini';
const DEFAULT_TIMEOUT_MS = 25000;

const DEFAULT_SYSTEM_PROMPT = [
  'Role: Tu es un assistant expert du sommeil et du developpement des enfants de 3 mois a 5 ans.',
  'Tu realises une analyse interne complete en mobilisant systematiquement le corpus interne des que la demande touche au sommeil, sante/confort, repetition, inquietude, persistance.',
  "Regle d'or: analyse interne profonde, reponse courte.",
  "Format de reponse obligatoire par defaut: sortie en 4 blocs max: 1) Ce que ca signifie le plus souvent (1-2 phrases). 2) En pratique (2-3 actions concretes max). 3) A surveiller (0-2 signaux max, uniquement si pertinent). 4) 1 question optionnelle (une seule) si une information manquante bloque la recommandation.",
  'Contraintes mobile: par defaut <= 600 caracteres OU <= 6 lignes. Interdit: paves, cours, jargon, longues reformulations. Listes: max 3 puces. Une seule prochaine action prioritaire si possible.',
  "Escalade (exception): tu peux depasser la limite uniquement si la situation est persistante/epuisante, ou suspicion de probleme medical, ou signes d'alerte. Dans ce cas: <= 1200 caracteres, toujours structure, sans digression.",
  'Posture et ton: simple, naturel, oral, rassurant sans minimiser. Pas de jugement, pas d injonctions. Respect de la diversite familiale.',
  'Cadre editorial: aucun nom propre, marque, methode nommee, univers proprietaire, discours promotionnel.',
  'Methodo: toujours integrer age, symptomes, contexte familial/emotionnel. Distinguer frequent / transitoire / ajustement / vigilance / incertitude.',
  "Regle d attribution editoriale obligatoire: toute reference implicite ou explicite a une expertise doit etre formulee comme provenant des expertes Kumo. Les contenus de reference internes sont consideres comme rediges par les expertes Kumo. Ne jamais mentionner fee dodo. Ne jamais mentionner une autre autorite, methode, programme ou entite. Ne pas sur-utiliser la formule: attribution naturelle et sobre.",
].join(' ');

function extractOutputText(payload: any): string {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const chunks: string[] = [];
  const output = Array.isArray(payload?.output) ? payload.output : [];

  for (const item of output) {
    if (item?.type !== 'message') continue;
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (part?.type === 'output_text' && typeof part?.text === 'string') {
        chunks.push(part.text);
      }
    }
  }

  return chunks.join('\n').trim();
}

function toInputItems(history: KumoMessage[], systemPrompt: string) {
  return [
    {
      role: 'developer',
      content: [{ type: 'input_text', text: systemPrompt }],
    },
    ...history.map((m) => ({
      role: m.role,
      content: [{ type: m.role === 'assistant' ? 'output_text' : 'input_text', text: m.content }],
    })),
  ];
}

async function fetchJsonWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<{ response: Response; data: any }> {
  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        controller.abort();
        reject(new Error('KUMO_REQUEST_TIMEOUT'));
      }, timeoutMs);
    });

    const response = await Promise.race([
      fetch(url, { ...init, signal: controller.signal }),
      timeoutPromise,
    ]) as Response;
    const rawText = await response.text();
    let data: any = null;
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { raw: rawText };
      }
    }
    return { response, data };
  } catch (error: any) {
    if (error?.name === 'AbortError' || String(error?.message || '') === 'KUMO_REQUEST_TIMEOUT') {
      throw new Error('KUMO_REQUEST_TIMEOUT');
    }
    throw error;
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function askKumo(history: KumoMessage[]): Promise<string> {
  const relayUrl = process.env.EXPO_PUBLIC_KUMO_RELAY_URL;
  const relayToken = process.env.EXPO_PUBLIC_KUMO_RELAY_TOKEN;
  const useRelay = process.env.EXPO_PUBLIC_KUMO_USE_RELAY === '1';
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  const model = process.env.EXPO_PUBLIC_OPENAI_MODEL || DEFAULT_MODEL;
  const systemPrompt = process.env.EXPO_PUBLIC_KUMO_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT;
  const vectorStoreId = process.env.EXPO_PUBLIC_KUMO_VECTOR_STORE_ID;
  const configuredTimeout = Number(process.env.EXPO_PUBLIC_KUMO_TIMEOUT_MS || DEFAULT_TIMEOUT_MS);
  const timeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout > 0
    ? configuredTimeout
    : DEFAULT_TIMEOUT_MS;

  if (relayUrl && useRelay) {
    const relayHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (relayToken) {
      relayHeaders['x-kumo-relay-token'] = relayToken;
    }

    const { response: relayResponse, data: relayData } = await fetchJsonWithTimeout(
      relayUrl,
      {
        method: 'POST',
        headers: relayHeaders,
        body: JSON.stringify({
          messages: history,
        }),
      },
      timeoutMs
    );

    if (!relayResponse.ok) {
      const message = relayData?.error || relayData?.message || 'Relay request failed';
      throw new Error(`KUMO_RELAY_ERROR: ${message}`);
    }
    if (typeof relayData?.text !== 'string' || !relayData.text.trim()) {
      throw new Error('KUMO_RELAY_EMPTY_RESPONSE');
    }
    return relayData.text.trim();
  }

  if (useRelay && !relayUrl) {
    throw new Error('KUMO_RELAY_URL_MISSING');
  }

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY_MISSING');
  }

  const requestBody: Record<string, any> = {
    model,
    input: toInputItems(history, systemPrompt),
    max_output_tokens: 500,
  };

  if (vectorStoreId) {
    requestBody.tools = [
      {
        type: 'file_search',
        vector_store_ids: [vectorStoreId],
        max_num_results: 6,
      },
    ];
  }

  const { response, data } = await fetchJsonWithTimeout(
    OPENAI_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    },
    timeoutMs
  );

  if (!response.ok) {
    const message = data?.error?.message || 'OpenAI request failed';
    throw new Error(`OPENAI_API_ERROR: ${message}`);
  }

  const text = extractOutputText(data);
  if (!text) {
    throw new Error('OPENAI_EMPTY_RESPONSE');
  }

  return text;
}
