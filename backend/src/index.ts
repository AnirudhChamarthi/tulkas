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
