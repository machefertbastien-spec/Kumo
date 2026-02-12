import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, 'utf8');
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!key || process.env[key] !== undefined) continue;
    process.env[key] = value;
  }
}

function bootEnv() {
  const cwdEnv = resolve(process.cwd(), '.env');
  const serverEnv = resolve(process.cwd(), 'server', '.env');
  loadEnvFile(cwdEnv);
  loadEnvFile(serverEnv);
}

bootEnv();

const PORT = Number(process.env.PORT || process.env.KUMO_RELAY_PORT || 8787);
const HOST = process.env.KUMO_RELAY_HOST || '0.0.0.0';
const ALLOWED_ORIGIN = process.env.KUMO_RELAY_ORIGIN || '*';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const RELAY_TOKEN = process.env.KUMO_RELAY_TOKEN;
const VECTOR_STORE_ID = process.env.KUMO_VECTOR_STORE_ID;
const OPENAI_URL = 'https://api.openai.com/v1/responses';

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
const SYSTEM_PROMPT = process.env.KUMO_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT;

if (!OPENAI_API_KEY) {
  console.error('[kumo-relay] Missing OPENAI_API_KEY (or EXPO_PUBLIC_OPENAI_API_KEY).');
  process.exit(1);
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-kumo-relay-token');
}

function json(res, status, body) {
  setCors(res);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

function sanitizeHistory(messages) {
  if (!Array.isArray(messages)) return [];
  const out = [];
  for (const item of messages.slice(-20)) {
    const role = item?.role === 'assistant' ? 'assistant' : item?.role === 'user' ? 'user' : null;
    const content = typeof item?.content === 'string' ? item.content.trim() : '';
    if (!role || !content) continue;
    out.push({ role, content });
  }
  return out;
}

function toInputItems(history) {
  return [
    {
      role: 'developer',
      content: [{ type: 'input_text', text: SYSTEM_PROMPT }],
    },
    ...history.map((m) => ({
      role: m.role,
      content: [{ type: m.role === 'assistant' ? 'output_text' : 'input_text', text: m.content }],
    })),
  ];
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === 'string' && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const chunks = [];
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

function cleanModelText(text) {
  return text
    .replace(/【[^】]*】/g, '')
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/g, ''))
    .join('\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function readJsonBody(req) {
  return await new Promise((resolveBody, rejectBody) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        rejectBody(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const parsed = raw ? JSON.parse(raw) : {};
        resolveBody(parsed);
      } catch {
        rejectBody(new Error('INVALID_JSON'));
      }
    });
    req.on('error', rejectBody);
  });
}

async function handleKumo(req, res) {
  if (RELAY_TOKEN) {
    const provided = req.headers['x-kumo-relay-token'];
    if (provided !== RELAY_TOKEN) {
      return json(res, 401, { error: 'Unauthorized' });
    }
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    const msg = String(error?.message || '');
    if (msg === 'PAYLOAD_TOO_LARGE') return json(res, 413, { error: 'Payload too large' });
    if (msg === 'INVALID_JSON') return json(res, 400, { error: 'Invalid JSON body' });
    return json(res, 400, { error: 'Unable to read request body' });
  }

  const history = sanitizeHistory(body?.messages);
  if (!history.length) {
    return json(res, 400, { error: 'messages is required and must contain user/assistant messages' });
  }

  try {
    const requestBody = {
      model: OPENAI_MODEL,
      input: toInputItems(history),
      max_output_tokens: 500,
    };

    if (VECTOR_STORE_ID) {
      requestBody.tools = [
        {
          type: 'file_search',
          vector_store_ids: [VECTOR_STORE_ID],
          max_num_results: 6,
        },
      ];
    }

    const openaiRes = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await openaiRes.json();
    if (!openaiRes.ok) {
      const message = data?.error?.message || 'OpenAI request failed';
      return json(res, 502, { error: message });
    }

    const rawText = extractOutputText(data);
    const text = cleanModelText(rawText);
    if (!text) {
      return json(res, 502, { error: 'OpenAI returned an empty response' });
    }

    return json(res, 200, { text });
  } catch (error) {
    console.error('[kumo-relay] request failed:', error);
    return json(res, 500, { error: 'Relay internal error' });
  }
}

const server = createServer(async (req, res) => {
  if (!req.url || !req.method) {
    return json(res, 400, { error: 'Bad request' });
  }

  if (req.method === 'OPTIONS') {
    setCors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'GET' && req.url === '/health') {
    return json(res, 200, { ok: true, model: OPENAI_MODEL });
  }

  if (req.method === 'POST' && req.url === '/api/kumo') {
    return handleKumo(req, res);
  }

  return json(res, 404, { error: 'Not found' });
});

server.listen(PORT, HOST, () => {
  console.log(`[kumo-relay] listening on http://${HOST}:${PORT}`);
  console.log(`[kumo-relay] health: http://${HOST}:${PORT}/health`);
  console.log(`[kumo-relay] endpoint: POST http://${HOST}:${PORT}/api/kumo`);
});
