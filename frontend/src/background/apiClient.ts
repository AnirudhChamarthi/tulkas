import { ScorePayload, JobStatus } from '../shared/types';
import { BACKEND_URL } from '../shared/constants';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    let msg = `API ${res.status}: ${path}`;
    try {
      const body = await res.json() as { error?: unknown };
      if (body?.error) msg = String(body.error);
    } catch {
      // non-json error body
    }
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

export async function fetchScore(entity: string, type: string): Promise<ScorePayload> {
  return apiFetch<ScorePayload>(
    `/score?entity=${encodeURIComponent(entity)}&type=${encodeURIComponent(type)}`
  );
}

export async function resolveHandle(handle: string, platform: string): Promise<string> {
  const res = await apiFetch<{ entity: string }>(
    `/score/resolve?handle=${encodeURIComponent(handle)}&platform=${encodeURIComponent(platform)}`
  );
  return res.entity || handle;
}

export async function resolveEntityAI(
  url:        string,
  title?:     string,
  candidates?: string[],
): Promise<{ entity: string; entityType: 'person' | 'org'; confidence?: 'high' | 'medium' | 'low' }> {
  return apiFetch<{ entity: string; entityType: 'person' | 'org'; confidence?: 'high' | 'medium' | 'low' }>(
    '/score/resolve-entity',
    {
      method: 'POST',
      body: JSON.stringify({ url, title, candidates }),
    }
  );
}

export async function fetchAdvancedScore(
  entityName: string,
  entityType: string,
  note?:      string,
): Promise<{ job_id: string }> {
  return apiFetch<{ job_id: string }>('/score/advanced', {
    method: 'POST',
    body:   JSON.stringify({ entity_name: entityName, entity_type: entityType, user_note: note }),
  });
}

export async function pollJobStatus(jobId: string): Promise<JobStatus> {
  return apiFetch<JobStatus>(`/score/status/${encodeURIComponent(jobId)}`);
}
