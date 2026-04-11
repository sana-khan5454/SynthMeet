# SynthMeet

SynthMeet is a full-stack meeting assistant for uploading or recording audio, generating transcripts, producing summaries with action items, searching timestamped segments, and exporting meeting notes as PDFs.

## Repository layout

- `client/` React + Vite frontend
- `server/` Express + MongoDB API for local development
- `api/` Vercel serverless entrypoint for production deployment

## Core features

- Drag-and-drop audio upload with format and size validation
- In-browser audio recording
- OpenAI Whisper transcription
- Structured summary generation with action items and timeline sections
- Search with timestamp jump links
- PDF export for meeting notes

## Local development

1. Create environment files from the examples:
   - `server/.env.example` -> `server/.env`
   - `client/.env.example` -> `client/.env`
2. Install dependencies:

```bash
npm run install:all
```

3. Start the API:

```bash
npm run dev:server
```

4. Start the frontend:

```bash
npm run dev:client
```

The client runs on Vite and proxies API requests to the local server.

## Required environment variables

### Server

- `PORT`
- `MONGO_URI`
- `OPENAI_API_KEY`
- `OPENAI_SUMMARY_MODEL` (optional, defaults to `gpt-4o-mini`)
- `CLIENT_ORIGIN` (optional, comma-separated)

### Client

- `VITE_API_BASE_URL` (optional in local development, use when frontend and API are hosted on different origins)

## Vercel deployment

This repository is configured to deploy from the repo root on Vercel.

- Build output: `client/dist`
- API runtime: `api/[...route].js`
- SPA rewrite: all non-API routes fall back to `index.html`

Set these environment variables in Vercel:

- `MONGO_URI`
- `OPENAI_API_KEY`
- `OPENAI_SUMMARY_MODEL` (optional)
- `CLIENT_ORIGIN`
- `VITE_API_BASE_URL` only if the frontend should talk to a different API origin

## Validation

```bash
npm run lint
npm run build
```
