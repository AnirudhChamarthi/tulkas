import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';

const s3 = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT,
  region:   'us-east-1',
  credentials: {
    accessKeyId:     process.env.SPACES_KEY     ?? '',
    secretAccessKey: process.env.SPACES_SECRET  ?? '',
  },
  forcePathStyle: false,
});

const BUCKET = process.env.SPACES_BUCKET ?? 'tulkas-evidence';

export async function uploadEvidence(
  entityId: string,
  queryHash: string,
  content: string
): Promise<string> {
  const key = `evidence/${entityId}/${queryHash}.txt`;
  await s3.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        content,
    ContentType: 'text/plain',
  }));
  return `${process.env.SPACES_ENDPOINT}/${BUCKET}/${key}`;
}

export async function downloadEvidence(blobUrl: string): Promise<string> {
  const url    = new URL(blobUrl);
  const key    = url.pathname.replace(`/${BUCKET}/`, '');
  const result = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const stream = result.Body as AsyncIterable<Uint8Array>;
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf-8');
}

export function hashQuery(entityName: string, dimension: string): string {
  return createHash('sha256')
    .update(`${entityName}:${dimension}`)
    .digest('hex')
    .slice(0, 12);
}
