import { uploadEvidence, hashQuery } from '../storage/spaces';

const GRADIENT_API_KEY      = () => process.env.GRADIENT_API_KEY ?? '';
const GRADIENT_KB_ID        = () => process.env.GRADIENT_KB_ID   ?? '';
const KB_BASE               = () => process.env.GRADIENT_INFERENCE_URL ?? 'https://inference.do-ai.run';
const RELEVANCE_THRESHOLD   = 0.5;
const MIN_PASSAGE_LENGTH    = 100;

interface KBPassage {
  content:    string;
  score:      number;
  source_url: string;
}

interface KBQueryResponse {
  passages?: KBPassage[];
  data?:     KBPassage[];
}

export async function queryKnowledgeBase(
  entityName: string,
  dimension:  string
): Promise<string | null> {
  const kbId = GRADIENT_KB_ID();
  if (!kbId) return null;

  const query = `${entityName} ${dimension} ethics`;

  try {
    const res = await fetch(`${KB_BASE()}/v1/knowledge-bases/${kbId}/query`, {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${GRADIENT_API_KEY()}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({ query, top_k: 3 }),
    });

    if (!res.ok) {
      console.warn(`[KB] Query HTTP ${res.status} for dimension: ${dimension}`);
      return null;
    }

    const data = await res.json() as KBQueryResponse;
    const passages = data.passages ?? data.data ?? [];

    const relevant = passages.filter(
      (p) => p.score >= RELEVANCE_THRESHOLD && p.content.length >= MIN_PASSAGE_LENGTH
    );

    return relevant.length > 0 ? relevant.map((p) => p.content).join('\n\n') : null;

  } catch (err) {
    console.warn(`[KB] Error:`, err instanceof Error ? err.message : String(err));
    return null;
  }
}

export async function indexEvidence(
  entityId:   string,
  entityName: string,
  dimension:  string,
  content:    string
): Promise<void> {
  try {
    const qHash = hashQuery(entityName, dimension);
    await uploadEvidence(entityId, qHash, content);
  } catch {
    // non-fatal
  }
}
