// Utility: flush the Valkey/Redis cache used by Tulkas.
// Safe to run any time; only wipes cached scores and job state.

const { createClient } = require('redis');

async function main() {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.error('REDIS_URL is not set; nothing to flush.');
    process.exit(1);
  }

  const client = createClient({
    url,
    socket: {
      tls: true,
      // In production this should normally be true; some local tunnels may need false.
      rejectUnauthorized: process.env.REDIS_INSECURE_TLS !== 'true',
    },
  });

  client.on('error', (err) => {
    console.error('Redis error:', err.message);
  });

  await client.connect();
  const res = await client.flushAll();
  console.log('Valkey flushAll result:', res);
  await client.quit();
}

main().catch((err) => {
  console.error('Flush failed:', err && err.message ? err.message : err);
  process.exit(1);
});

