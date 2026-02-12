# Kumo Relay (Backend Endpoint)

This relay keeps the OpenAI key on the server side and exposes:

- `GET /health`
- `POST /api/kumo`

## 1) Configure env

Create `server/.env`:

```bash
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
KUMO_RELAY_PORT=8787
# Optional knowledge files (recommended)
# KUMO_VECTOR_STORE_ID=vs_...
# Optional custom behavior prompt
# KUMO_SYSTEM_PROMPT=Tu es un expert du sommeil des enfants...
# Optional hardening:
# KUMO_RELAY_TOKEN=change-me
# KUMO_RELAY_ORIGIN=*
```

## 2) Start server

From project root:

```bash
npm run relay:start
```

## Deploy to Render (stable URL)

This repo now includes `render.yaml` + `server/package.json`.

1. Push this repo to GitHub.
2. In Render: **New** -> **Blueprint**.
3. Select the repo.
4. Render creates the `kumo-relay` service automatically.
5. Set env vars in Render service:
   - `OPENAI_API_KEY=...` (required)
   - `OPENAI_MODEL=gpt-4.1-mini` (optional)
   - `KUMO_VECTOR_STORE_ID=vs_...` (optional)
   - `KUMO_RELAY_TOKEN=...` (optional, if you want token protection)
6. Deploy and verify:
   - `https://<your-service>.onrender.com/health`
   - relay endpoint: `https://<your-service>.onrender.com/api/kumo`

## 3) Point the app to relay

In app `.env`:

```bash
EXPO_PUBLIC_KUMO_RELAY_URL=http://YOUR_LOCAL_IP:8787/api/kumo
# Optional if relay token is enabled:
# EXPO_PUBLIC_KUMO_RELAY_TOKEN=change-me
```

Then restart Expo.

## About ChatGPT GPT links

A ChatGPT GPT link like `https://chatgpt.com/g/...` cannot be called directly from this mobile app backend API.
To replicate that agent, copy its instructions into `KUMO_SYSTEM_PROMPT`.

## Knowledge files (RAG)

To use internal documents (PDF, DOCX, TXT) with Kumo:

1. Create a Vector Store in OpenAI.
2. Upload your knowledge files into that Vector Store.
3. Copy the resulting `vs_...` id.
4. Set `KUMO_VECTOR_STORE_ID=vs_...` in `server/.env`.
5. Restart relay.

When `KUMO_VECTOR_STORE_ID` is set, `/api/kumo` automatically enables `file_search`.

### Automated upload from `server/knowledge`

You can upload all supported files (`.txt`, `.md`, `.pdf`, `.docx`) with:

```bash
npm run relay:upload-knowledge -- --write-env
```

Options:

- `--dir server/knowledge` custom folder
- `--vector-store-id vs_...` use existing store
- `--name "Kumo Knowledge"` name when creating a new store

If no `--vector-store-id` and no `KUMO_VECTOR_STORE_ID`, the script creates a new vector store and prints the id.

## Request format

`POST /api/kumo`

```json
{
  "messages": [
    { "role": "user", "content": "Mon bebe se reveille souvent, que faire ?" }
  ]
}
```

Response:

```json
{ "text": "..." }
```
