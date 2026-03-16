import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const connectionString = process.env.DATABASE_URL.replace('sslmode=require', 'sslmode=no-verify');

// Debug: log host (safe) to diagnose ENOTFOUND
try {
  const u = new URL(connectionString.replace(/^postgresql:/, 'postgres:'));
  console.log('[DB] Connecting to host:', u.hostname);
} catch {
  console.warn('[DB] DATABASE_URL parse failed, length:', connectionString?.length);
}

export const pgPool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pgPool.on('error', (err) => {
  console.error('Postgres pool error:', err.message);
});
