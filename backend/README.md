# Tulkas — Backend API

Node.js 20 + Express REST API. Serves score data to the browser extension.

## Stack

- **Runtime**: Node.js 20, TypeScript
- **Framework**: Express
- **Database**: DigitalOcean Managed PostgreSQL (read-only, pre-seeded reference data)
- **Cache**: DigitalOcean Managed Redis/Valkey (live scores, job status)
- **Storage**: DigitalOcean Spaces (raw evidence blobs)
- **AI**: DigitalOcean Gradient Serverless Inference (Tier 1 scoring)
- **Agent**: DigitalOcean Gradient ADK (Tier 2 deep research)
- **Search**: Brave Search API

## Routes

| Method | Path | Description |
|---|---|---|
| GET | `/score?entity=:name&type=:type` | Fetch score (Redis → Postgres → live Tier 1) |
| POST | `/score/advanced` | Trigger Tier 2 deep research agent |
| GET | `/score/status/:jobId` | Poll advanced job status |

## Structure

```
src/
├── index.ts          ← Express app entry point
├── api/
│   ├── score.ts      ← GET /score, POST /score/advanced
│   └── status.ts     ← GET /score/status/:jobId
├── db/
│   ├── client.ts     ← Postgres connection pool
│   ├── entities.ts   ← findEntityByName()
│   └── scores.ts     ← getStaticScore(), getAssociations()
├── cache/
│   └── redis.ts      ← getCachedScore(), setCachedScore()
├── storage/
│   └── spaces.ts     ← uploadEvidence(), downloadEvidence()
├── search/
│   ├── braveSearch.ts    ← Brave Search API client
│   └── gradientKB.ts     ← Knowledge Base query + index
└── agents/
    ├── basicScorer.ts        ← Tier 1 orchestrator
    ├── advancedAgent.ts      ← Tier 2 ReAct loop
    ├── associationAgent.ts   ← Three-gate association analysis
    ├── llmClient.ts          ← Gradient inference wrapper
    └── entityExtractor.ts    ← News article subject extraction
```

## Environment variables

All required variables are defined in `../.env`. See root `.env` for values.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `REDIS_URL` | Redis/Valkey connection string |
| `SPACES_KEY` / `SPACES_SECRET` | Spaces authentication |
| `SPACES_ENDPOINT` / `SPACES_BUCKET` | Spaces bucket config |
| `GRADIENT_API_KEY` | Gradient model access key |
| `GRADIENT_MODEL_ID` | Claude Haiku (Tier 1) |
| `GRADIENT_MODEL_ID_ADVANCED` | Claude Sonnet (Tier 2) |
| `GRADIENT_INFERENCE_URL` | Gradient inference base URL |
| `GRADIENT_KB_ID` | Knowledge Base ID |
| `GRADIENT_AGENT_ENDPOINT` | ADK agent endpoint (set in Step 4) |
| `BRAVE_SEARCH_KEY` | Brave Search API key |
| `FUNCTION_BRAVE_SEARCH_URL` | DO Function: brave-search |
| `FUNCTION_ARTICLE_FETCH_URL` | DO Function: article-fetch |

## Running locally

```bash
npm install
npm run dev      # ts-node-dev with hot reload
npm run build    # compile to dist/
npm start        # run compiled output
```

## Deployment

Deployed via DigitalOcean App Platform using `../infra/app.yaml`.
Every push to `main` triggers an automatic redeploy.
