# DigitalOcean & Gradient AI Integration

Tulkas uses four DigitalOcean managed services and three Gradient AI APIs.
The backend (Node.js/Express) runs on **App Platform**, stores curated entity scores in **Managed Postgres**, caches live scores and job state in **Managed Valkey**, and persists raw evidence in **Spaces**.
Gradient AI powers all intelligence: **Inference** for LLM scoring and classification, **Knowledge Base** for evidence recall, and an **ADK Agent** for deep Tier 2 research.

---

## DigitalOcean Services

### App Platform

The backend is deployed as a single-instance Node.js app on DigitalOcean App Platform.

| Aspect | Detail |
|--------|--------|
| Entry point | `backend/dist/index.js` (compiled from `src/index.ts`) |
| Port | `PORT` env var, defaults to `8081` |
| Environment | All secrets (`DATABASE_URL`, `REDIS_URL`, `GRADIENT_API_KEY`, etc.) are set as App Platform environment variables |
| CORS | Allows all origins so the browser extension can call the API from any tab |
| Rate limiting | In-memory per-IP limiter (300 req/min for scoring, 10 req/10 min for advanced research) — viable because App Platform runs a single instance |

The production backend URL (e.g. `https://tulkas-backend-ctpjf.ondigitalocean.app`) is baked into the extension at build time via the `VITE_BACKEND_URL_PROD` variable in `frontend/.env.chrome` and `frontend/.env.firefox`.

### Managed Postgres

A read-only database of human-curated entity scores. The backend checks Postgres before running any live AI scoring, making it the fastest path for known entities.

| Aspect | Detail |
|--------|--------|
| Client | `backend/src/db/client.ts` — `pg` Pool, max 10 connections, TLS with `rejectUnauthorized: false` |
| Connection | `DATABASE_URL` env var (standard Postgres connection string) |
| Schema | Single `entities` table with columns: `id`, `name`, `entity_type`, `description`, six score columns (`score_env`, `score_labor`, `score_integrity`, `score_political`, `score_community`, `score_conduct`), `score_avg`, six justification columns, and an `aliases` table for alternate names |
| Seed data | `infra/db/seed.sql` — pre-populated entries for well-known entities (e.g. Martin Luther King Jr., Coretta Scott King) |
| Lookup | `backend/src/db/entities.ts` — `findEntityByName()` queries by exact name or alias match |
| Access control | IP allowlist configured in DigitalOcean dashboard under Databases > Trusted Sources |

### Managed Valkey (Redis-compatible)

All ephemeral state lives in Valkey: cached scores (7-day TTL), advanced-scoring job status (24-hour TTL), scorable-gate classifications, and entity resolution results.

| Aspect | Detail |
|--------|--------|
| Client | `backend/src/cache/redis.ts` — `redis` package, TLS enabled |
| Connection | `REDIS_URL` env var; `REDIS_INSECURE_TLS=true` to skip cert verification if needed |
| Key patterns | `entity:{hash}:tier{1\|2}` (scores), `job:{uuid}` (job status), `scorable_gate:{hash}` (classification), `resolve:{handle}:{platform}` and `resolve_entity:{hash}` (entity resolution) |
| Cache flush | `backend/scripts/flush-valkey.js` flushes all keys; run via `npm run flush:valkey` |
| Automation | `.github/workflows/flush-valkey.yml` flushes the cache on every push to `main` |

### Spaces (S3-compatible Object Storage)

Raw evidence text (search snippets, research summaries) is stored in Spaces so it can be referenced by the Knowledge Base and re-downloaded for Tier 2 research.

| Aspect | Detail |
|--------|--------|
| Client | `backend/src/storage/spaces.ts` — AWS SDK v3 `S3Client` pointed at the Spaces endpoint |
| Bucket | `SPACES_BUCKET` env var, defaults to `tulkas-evidence` |
| Credentials | `SPACES_KEY` and `SPACES_SECRET` env vars (Spaces access key pair) |
| Write path | `evidence/{entityId}/{queryHash}.txt` — one file per entity-dimension pair |
| Usage | `basicScorer.ts` uploads Brave Search evidence after Tier 1 scoring; `advancedScorer.ts` uploads Tier 2 research summaries |

---

## Gradient AI APIs

### Inference API (Tier 1 Scoring + Classification)

All LLM calls — scoring, entity resolution, the scorable-gate classifier — go through the Gradient Inference API.

| Aspect | Detail |
|--------|--------|
| Client | `backend/src/agents/llmClient.ts` |
| Endpoint | `GRADIENT_INFERENCE_URL` env var, defaults to `https://inference.do-ai.run` |
| Model | `GRADIENT_MODEL_ID` env var, defaults to `anthropic-claude-haiku-4.5` |
| Auth | `GRADIENT_API_KEY` env var, sent as `Bearer` token |
| Functions | `callLLMRaw(prompt)` — raw single-turn completion (20s timeout); `callInference(entity, type, evidence)` — structured 6-dimension scoring with system prompt (25s timeout) |
| Scoring prompt | `SYSTEM_PROMPT` in `llmClient.ts` — defines the global contract, dimension rubrics, conduct ladder, and three-gate association test |

### Knowledge Base API (Evidence Recall)

Before running a web search, the scorer checks the Gradient Knowledge Base for previously indexed evidence on each dimension.

| Aspect | Detail |
|--------|--------|
| Client | `backend/src/search/gradientKB.ts` |
| Endpoint | `{GRADIENT_INFERENCE_URL}/v1/knowledge-bases/{GRADIENT_KB_ID}/query` |
| Auth | `GRADIENT_API_KEY` |
| Behaviour | Sends `{query, top_k: 3}`, filters results by relevance threshold (0.5) and minimum passage length (100 chars) |
| Indexing | After Brave Search gathers new evidence, `indexEvidence()` uploads it to Spaces (the KB indexes from the bucket externally) |

### ADK Agent API (Tier 2 Deep Research)

Tier 2 "Advanced Search" uses a Gradient ADK agent that runs a multi-step research loop, producing longer and more detailed justifications than Tier 1.

| Aspect | Detail |
|--------|--------|
| Client | `backend/src/agents/advancedScorer.ts` |
| Endpoint | `GRADIENT_AGENT_ENDPOINT` env var |
| Auth | `GRADIENT_AGENT_KEY` env var |
| Timeout | 3 minutes (180s) — the agent performs iterative research |
| Behaviour | Receives the entity name, type, Tier 1 baseline scores, and optional user note; returns updated 6-dimension scores with deeper justifications |
| Job tracking | Results are written to Valkey under `job:{uuid}`; the frontend polls `GET /score/status/:jobId` |

---

## Environment Variables Reference

| Variable | Service | Required | Default |
|----------|---------|----------|---------|
| `DATABASE_URL` | Managed Postgres | Yes | — |
| `REDIS_URL` | Managed Valkey | Yes | — |
| `REDIS_INSECURE_TLS` | Managed Valkey | No | `false` |
| `PORT` | App Platform | No | `8081` |
| `GRADIENT_API_KEY` | Gradient Inference + KB | Yes | — |
| `GRADIENT_INFERENCE_URL` | Gradient Inference + KB | No | `https://inference.do-ai.run` |
| `GRADIENT_MODEL_ID` | Gradient Inference | No | `anthropic-claude-haiku-4.5` |
| `GRADIENT_KB_ID` | Gradient Knowledge Base | No | — (KB disabled if empty) |
| `GRADIENT_AGENT_ENDPOINT` | Gradient ADK Agent | No | — (Tier 2 disabled if empty) |
| `GRADIENT_AGENT_KEY` | Gradient ADK Agent | No | — |
| `SPACES_ENDPOINT` | DO Spaces | Yes | — |
| `SPACES_KEY` | DO Spaces | Yes | — |
| `SPACES_SECRET` | DO Spaces | Yes | — |
| `SPACES_BUCKET` | DO Spaces | No | `tulkas-evidence` |
| `BRAVE_SEARCH_KEY` | Brave Search (external) | Yes | — |
| `VITE_BACKEND_URL_PROD` | Frontend build | Yes (for prod builds) | — |
