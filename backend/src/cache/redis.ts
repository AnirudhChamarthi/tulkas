import { createClient } from 'redis';
import { createHash } from 'crypto';
import { ScorePayload, JobStatus } from '../types';

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL environment variable is required');
}

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: process.env.REDIS_INSECURE_TLS !== 'true',
  },
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err.message);
});

const SCORE_TTL = 60 * 60 * 24 * 7; // 7 days
const JOB_TTL   = 60 * 60 * 24;     // 24 hours

export function entityHash(name: string, type: string): string {
  return createHash('sha256')
    .update(`${name.toLowerCase()}:${type}`)
    .digest('hex')
    .slice(0, 16);
}

export async function getCachedScore(
  name: string,
  type: string,
  tier: 1 | 2 = 1
): Promise<ScorePayload | null> {
  const key = `entity:${entityHash(name, type)}:tier${tier}`;
  const raw = await redisClient.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ScorePayload;
  } catch {
    return null;
  }
}

export async function setCachedScore(
  name: string,
  type: string,
  payload: ScorePayload,
  tier: 1 | 2 = 1,
  ttl: number = SCORE_TTL
): Promise<void> {
  const key = `entity:${entityHash(name, type)}:tier${tier}`;
  await redisClient.set(key, JSON.stringify(payload), { EX: ttl });
}

export async function getJobStatus(jobId: string): Promise<JobStatus | null> {
  const raw = await redisClient.get(`job:${jobId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as JobStatus;
  } catch {
    return null;
  }
}

export async function setJobStatus(
  jobId: string,
  status: JobStatus,
  ttl: number = JOB_TTL
): Promise<void> {
  await redisClient.set(`job:${jobId}`, JSON.stringify(status), { EX: ttl });
}
