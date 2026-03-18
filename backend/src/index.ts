import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from project root (local dev) or backend/ (App Platform). Silent if missing.
[resolve(__dirname, '../../.env'), resolve(__dirname, '../.env')].forEach((p) => {
  config({ path: p, override: false });
});
import express from 'express';
import cors from 'cors';
import { scoreRouter } from './api/score';
import { statusRouter } from './api/status';
import { redisClient } from './cache/redis';
import { pgPool } from './db/client';

const app = express();
const PORT = process.env.PORT ?? 8081;

app.use(cors());
app.use(express.json());

// ── Basic in-memory rate limiting ──────────────────────────────────────────
// This is intended as a high, public-safety guardrail to prevent burning
// Brave/Gradient/agent budgets. App Platform runs a single instance, so an
// in-memory limiter is sufficient.
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

function clientIp(req: express.Request): string {
  const xff = req.headers['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) {
    return xff.split(',')[0]?.trim();
  }
  return req.ip ?? 'unknown';
}

function makeLimiter(windowMs: number, max: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = clientIp(req);
    const now = Date.now();

    const bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (bucket.count >= max) {
      res.status(429).json({ error: 'Rate limit exceeded' });
      return;
    }

    bucket.count += 1;
    buckets.set(key, bucket);
    return next();
  };
}

// High limit for normal score/status/resolve calls
const limiterHigh = makeLimiter(60_000, 300);
// Much stricter for deep research (expensive)
const limiterAdvanced = makeLimiter(600_000, 10);

app.use('/score', limiterHigh);
app.use('/score/advanced', limiterAdvanced);

app.use('/score', scoreRouter);
app.use('/score', statusRouter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

async function start() {
  await redisClient.connect();
  console.log('Redis connected');

  await pgPool.query('SELECT 1');
  console.log('Postgres connected');

  app.listen(PORT, () => {
    console.log(`Tulkas API listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Startup failed:', err);
  process.exit(1);
});
