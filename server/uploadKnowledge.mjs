import { existsSync, readFileSync, readdirSync, statSync, appendFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve, extname, basename } from 'node:path';

const OPENAI_BASE_URL = 'https://api.openai.com/v1';
const ALLOWED_EXTENSIONS = new Set(['.txt', '.md', '.pdf', '.docx']);

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const raw = readFileSync(path, 'utf8');
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!key || process.env[key] !== undefined) continue;
    process.env[key] = value;
  }
}

function bootEnv() {
  loadEnvFile(resolve(process.cwd(), '.env'));
  loadEnvFile(resolve(process.cwd(), 'server', '.env'));
}

function getArg(name) {
  const withEquals = process.argv.find((a) => a.startsWith(`${name}=`));
  if (withEquals) return withEquals.slice(name.length + 1);
  const idx = process.argv.indexOf(name);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return '';
}

function hasArg(name) {
  return process.argv.includes(name);
}

function listKnowledgeFiles(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const fullPath = resolve(dir, entry);
    const st = statSync(fullPath);
    if (!st.isFile()) continue;
    const ext = extname(entry).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) continue;
    files.push(fullPath);
  }
  return files;
}

async function openaiJson(path, apiKey, method, body) {
  const res = await fetch(`${OPENAI_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    const err = data?.error?.message || `Request failed: ${method} ${path}`;
    throw new Error(err);
  }
  return data;
}

async function uploadFile(apiKey, filePath) {
  const bytes = await readFile(filePath);
  const form = new FormData();
  form.append('purpose', 'assistants');
  form.append('file', new Blob([bytes]), basename(filePath));

  const res = await fetch(`${OPENAI_BASE_URL}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: form,
  });

  const data = await res.json();
  if (!res.ok) {
    const err = data?.error?.message || `File upload failed: ${basename(filePath)}`;
    throw new Error(err);
  }
  return data;
}

async function waitForBatch(apiKey, vectorStoreId, batchId, timeoutMs = 10 * 60 * 1000) {
  const started = Date.now();
  while (true) {
    const batch = await openaiJson(
      `/vector_stores/${vectorStoreId}/file_batches/${batchId}`,
      apiKey,
      'GET'
    );
    const status = String(batch?.status || '');
    process.stdout.write(`\r[upload] batch status: ${status}     `);

    if (status === 'completed' || status === 'failed' || status === 'cancelled') {
      process.stdout.write('\n');
      return batch;
    }

    if (Date.now() - started > timeoutMs) {
      process.stdout.write('\n');
      throw new Error('Timed out while waiting for vector store indexing.');
    }

    await new Promise((r) => setTimeout(r, 2500));
  }
}

function maybeWriteVectorStoreId(vectorStoreId) {
  const shouldWrite = hasArg('--write-env');
  if (!shouldWrite) return;

  const envPath = resolve(process.cwd(), 'server', '.env');
  const current = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';
  if ((/^\s*KUMO_VECTOR_STORE_ID=/m).test(current)) return;
  appendFileSync(envPath, `${current.endsWith('\n') || current.length === 0 ? '' : '\n'}KUMO_VECTOR_STORE_ID=${vectorStoreId}\n`);
  console.log(`[upload] wrote KUMO_VECTOR_STORE_ID to server/.env`);
}

async function main() {
  bootEnv();

  const apiKey = process.env.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY (or EXPO_PUBLIC_OPENAI_API_KEY) in .env / server/.env');
  }

  const dirArg = getArg('--dir');
  const dir = resolve(process.cwd(), dirArg || 'server/knowledge');
  if (!existsSync(dir)) {
    throw new Error(`Knowledge directory not found: ${dir}`);
  }

  const files = listKnowledgeFiles(dir);
  if (!files.length) {
    throw new Error(
      `No supported files found in ${dir}. Supported extensions: ${[...ALLOWED_EXTENSIONS].join(', ')}`
    );
  }

  console.log(`[upload] found ${files.length} files in ${dir}`);

  const fileIds = [];
  for (let i = 0; i < files.length; i += 1) {
    const p = files[i];
    console.log(`[upload] (${i + 1}/${files.length}) uploading ${basename(p)} ...`);
    const up = await uploadFile(apiKey, p);
    fileIds.push(up.id);
  }

  let vectorStoreId = getArg('--vector-store-id') || process.env.KUMO_VECTOR_STORE_ID || process.env.EXPO_PUBLIC_KUMO_VECTOR_STORE_ID;
  if (!vectorStoreId) {
    const storeName = getArg('--name') || process.env.KUMO_VECTOR_STORE_NAME || `kumo-knowledge-${Date.now()}`;
    const created = await openaiJson('/vector_stores', apiKey, 'POST', { name: storeName });
    vectorStoreId = created.id;
    console.log(`[upload] created vector store: ${vectorStoreId}`);
  } else {
    console.log(`[upload] using vector store: ${vectorStoreId}`);
  }

  const batch = await openaiJson(
    `/vector_stores/${vectorStoreId}/file_batches`,
    apiKey,
    'POST',
    { file_ids: fileIds }
  );
  console.log(`[upload] batch created: ${batch.id}`);

  const finalBatch = await waitForBatch(apiKey, vectorStoreId, batch.id);
  const failed = Number(finalBatch?.file_counts?.failed || 0);
  const completed = Number(finalBatch?.file_counts?.completed || 0);
  const total = Number(finalBatch?.file_counts?.total || fileIds.length);

  console.log(`[upload] done: ${completed}/${total} indexed, ${failed} failed`);
  console.log(`[upload] KUMO_VECTOR_STORE_ID=${vectorStoreId}`);

  maybeWriteVectorStoreId(vectorStoreId);

  if (failed > 0) {
    process.exitCode = 2;
  }
}

main().catch((err) => {
  console.error(`[upload] error: ${err?.message || err}`);
  process.exit(1);
});
