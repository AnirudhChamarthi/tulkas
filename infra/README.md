# Tulkas — Infrastructure

DigitalOcean provisioning config and database files. Run once during setup — not touched at runtime.

## Contents

```
infra/
└── db/
    ├── schema.sql  ← Creates the entities table (run once against Postgres)
    └── seed.sql    ← Populates ~150 entities with curated scores (run once)
```

## Database

The Postgres database is **read-only at runtime**. The application user (`doadmin`) has SELECT-only access. No application code inserts, updates, or deletes rows.

To re-run the schema or seed against the live database:

```bash
psql $DATABASE_URL -f infra/db/schema.sql
psql $DATABASE_URL -f infra/db/seed.sql
```

## App Platform

`app.yaml` at the repo root defines the backend web service, its build/run commands, and references to the managed Postgres and Redis clusters. Deploy by connecting the GitHub repo to App Platform in the DigitalOcean dashboard — it reads `app.yaml` automatically.

## What is NOT here

- No credentials or connection strings — those live in `.env` (gitignored)
- No runtime state — live scores live in Redis, evidence in Spaces
