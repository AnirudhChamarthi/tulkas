/**
 * Test connectivity to all external services used by the Tulkas backend.
 * Run from backend/: npx ts-node scripts/test-endpoints.ts
 *
 * Requires .env at repo root with: REDIS_URL, DATABASE_URL, BRAVE_SEARCH_KEY,
 * GRADIENT_API_KEY, GRADIENT_KB_ID, SPACES_ENDPOINT, SPACES_KEY, SPACES_SECRET, SPACES_BUCKET
 */
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../../.env') });

const REDIS_URL      = process.env.REDIS_URL;
const DATABASE_URL   = process.env.DATABASE_URL;
const BRAVE_KEY      = process.env.BRAVE_SEARCH_KEY;
const GRADIENT_KEY   = process.env.GRADIENT_API_KEY;
const GRADIENT_KB_ID = process.env.GRADIENT_KB_ID;
const SPACES_EP      = process.env.SPACES_ENDPOINT;
const SPACES_KEY     = process.env.SPACES_KEY;
const SPACES_SECRET  = process.env.SPACES_SECRET;
const SPACES_BUCKET  = process.env.SPACES_BUCKET ?? 'tulkas-evidence';

async function test(name: string, fn: () => Promise<void>): Promise<number> {
  const start = Date.now();
  try {
    await fn();
    console.log(`  ✓ ${name} (${Date.now() - start}ms)`);
    return Date.now() - start;
  } catch (err) {
    console.error(`  ✗ ${name}:`, err instanceof Error ? err.message : err);
    return -1;
  }
}

async function main() {
  console.log('\n--- Tulkas backend connectivity tests ---\n');

  // 1. Redis (DigitalOcean Valkey)
  await test('Redis', async () => {
    if (!REDIS_URL) throw new Error('REDIS_URL not set');
    const { createClient } = await import('redis');
    const client = createClient({ url: REDIS_URL });
    await client.connect();
    await client.ping();
    await client.quit();
  });

  // 2. Postgres (DigitalOcean)
  await test('Postgres', async () => {
    if (!DATABASE_URL) throw new Error('DATABASE_URL not set');
    const { default: pg } = await import('pg');
    const pool = new pg.Pool({ connectionString: DATABASE_URL });
    await pool.query('SELECT 1');
    await pool.end();
  });

  // 3. Brave Search
  await test('Brave Search', async () => {
    if (!BRAVE_KEY) throw new Error('BRAVE_SEARCH_KEY not set');
    const res = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=test&count=1`,
      {
        headers: {
          'Accept': 'application/json',
          'X-Subscription-Token': BRAVE_KEY,
        },
      }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  // 4. Gradient Knowledge Base (often returns 401 if key/KB invalid)
  const kbMs = await test('Gradient KB', async () => {
    if (!GRADIENT_KEY || !GRADIENT_KB_ID) throw new Error('GRADIENT_API_KEY or GRADIENT_KB_ID not set');
    const res = await fetch(
      `https://inference.do-ai.run/v1/knowledge-bases/${GRADIENT_KB_ID}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GRADIENT_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'Elon Musk environment ethics', top_k: 1 }),
      }
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
    }
  });
  if (kbMs < 0) {
    console.log('  → KB 401/403 usually means: expired key, wrong KB ID, or Gradient API change.');
    console.log('  → When KB fails, scoring falls back to Brave Search for ALL 6 dimensions → much slower.');
  }

  // 5. DigitalOcean Spaces (S3-compatible)
  await test('DigitalOcean Spaces', async () => {
    if (!SPACES_EP || !SPACES_KEY || !SPACES_SECRET) throw new Error('SPACES_* not set');
    const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3');
    const s3 = new S3Client({
      endpoint: SPACES_EP,
      region: 'us-east-1',
      credentials: { accessKeyId: SPACES_KEY, secretAccessKey: SPACES_SECRET },
    });
    await s3.send(new HeadBucketCommand({ Bucket: SPACES_BUCKET }));
  });

  // 6. Local API (if running)
  await test('Local API /health', async () => {
    const res = await fetch('http://localhost:8081/health');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  console.log('\n--- Done ---\n');
}

main().catch(console.error);
