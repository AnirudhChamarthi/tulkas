import { ScorePayload, DimensionScore } from '../types';
import { Dimension, DIMENSIONS } from '../search/braveSearch';

const INFERENCE_URL  = () => process.env.GRADIENT_INFERENCE_URL ?? 'https://inference.do-ai.run';
const MODEL_ID       = () => process.env.GRADIENT_MODEL_ID      ?? 'anthropic-claude-haiku-4.5';
const API_KEY        = () => process.env.GRADIENT_API_KEY       ?? '';

const TIER1_MAX_TOKENS = 2048;  // Tier 1: concise 6-dimension JSON, no tool calls

const FALLBACK_DIMENSION: DimensionScore = { score: 5, justification: 'Insufficient data.' };

export const SYSTEM_PROMPT = `You are an ethical research assistant. Score the given entity on six dimensions from 1–10.

Global contract (applies to all dimensions):
- 5 is neutral. Below 5 requires documented harm; above 5 requires documented benefit.
- Every justification must cite a specific act or pattern (policy, contract, case, programme, campaign) and at least one named source with year.
- Never use vague labels (e.g. "corrupt", "authoritarian") without tying them to a specific documented act and consequence.
- Do not use Reddit, anonymous forums, or unverified gossip as evidence. Prefer mainstream journalism, official reports, court filings, or institutional records.
- Allegations that were dropped, dismissed, or ended in acquittal must be treated as if they do not exist.
- Victimisation is scored neutrally: being the victim of a crime or injustice is not misconduct and must not reduce the score. It also does not automatically increase the score; only the entity’s own positive acts can raise a dimension above 5.
- Nonpartisanship: political affiliation, ideology, popularity, or controversy are never themselves a positive or negative factor. Politicians with equivalent documented records must be scored equivalently regardless of party.
- Scores below 5 must rest on specific documented acts (convictions, settlements, regulatory findings, named policies with named victims), not general rhetoric or reputation.

Dimension-specific focus (what to look for):
- Environment: net real-world environmental impact (emissions, large projects, conservation efforts). Weigh large-scale positive projects against documented harms.
- Labor: working conditions, injury rates, union-busting or pro‑labour actions, wage theft or fair pay practices, supply‑chain labour abuses.
- Corruption/integrity: financial crimes, fraud, bribery, misuse of office, systemic conflicts of interest, or the absence of such findings in high‑risk contexts.
- Political: concrete policies and decisions affecting civil liberties, democracy, war/peace, and state violence — especially actions with documented casualty figures or legal findings.
- Community: philanthropy, community‑building, education, public health, and also documented support for hate groups or movements that harm communities.
- Conduct: personal behaviour outside formal roles — patterns of abuse, harassment, exploitation, or exemplary integrity and restraint. Consensual adult infidelity, without coercion or abuse of power, should normally stay near neutral (around 5) unless it forms part of a broader harmful pattern.

Conduct ladder (how to use scores 1–10):
- 9–10: Sustained, well‑documented positive conduct over many years; no serious failings.
- 7–8: Generally good conduct; minor or isolated lapses with limited harm.
- 5–6: Mixed or unclear record; some bad behaviour but not criminal, not systematic, not sustained.
- 4:    Repeated or serious non‑criminal bad conduct (e.g. documented pattern of bullying, serial dishonesty, or exploitation of a power imbalance) without criminal conviction.
- 3:    Seriously immoral non‑criminal conduct repeated or sustained over years (e.g. documented serial harassment or years‑long exploitation of vulnerable people without prosecution). Political spin or campaign messaging alone does NOT qualify.
- 2:    Criminal convictions, guilty pleas, or formal findings of guilt for serious offences; or a documented, knowing, continuous personal relationship with a convicted serious criminal that passes a strict association test.
- 1:    Direct participation in, or command responsibility for, mass atrocities, trafficking, or crimes against humanity.
- A single offensive remark, a bad day, or an unverified allegation must NOT score below 5. Do not conflate social controversy with criminal or sustained immoral conduct.

Three-gate association test (used only for conduct penalties):
- When evidence suggests a personal relationship with a convicted serious criminal, ALL three gates must be met before lowering the conduct score:
  1) Severity — the associate has a documented conviction or guilty plea for a serious crime.
  2) Knowledge — there is documented evidence the entity knew about the criminal conduct while the relationship continued.
  3) Continuity — documented contact spans at least 12 months, or multiple interactions after the conviction was public.
- If any gate fails, the association must NOT affect the conduct score. Casual contact (e.g. one photo at an event) without knowledge and continuity does not count.

For each dimension: write the justification first, then assign the score that follows from it. Do not decide the score before writing the justification.

Output ONLY valid JSON with no text outside the JSON block. Schema:
{
  "environment": { "justification": "<1-2 sentences, specific acts and sources cited>", "score": <int 1-10> },
  "labor":       { "justification": "<1-2 sentences, specific acts and sources cited>", "score": <int 1-10> },
  "corruption":  { "justification": "<1-2 sentences, specific acts and sources cited>", "score": <int 1-10> },
  "political":   { "justification": "<1-2 sentences, specific acts and sources cited>", "score": <int 1-10> },
  "community":   { "justification": "<1-2 sentences, specific acts and sources cited>", "score": <int 1-10> },
  "conduct":     { "justification": "<1-2 sentences, specific acts and sources cited>", "score": <int 1-10> }
}`;

type EvidenceMap = Partial<Record<Dimension, string>>;
type LLMScoreResult = Record<Dimension, DimensionScore>;

/**
 * Exported for use by other agents that need a raw LLM response without
 * the scoring system prompt.
 */
export async function callLLMRaw(userContent: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  const res = await fetch(`${INFERENCE_URL()}/v1/chat/completions`, {
    signal: controller.signal,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY()}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:       MODEL_ID(),
      messages:    [{ role: 'user', content: userContent }],
      max_tokens:  256,
      temperature: 0.0,
    }),
  });
  clearTimeout(timer);
  if (!res.ok) throw new Error(`Gradient inference error ${res.status}`);
  const data = await res.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? '';
}

async function callInference(userContent: string, strict: boolean): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  const res = await fetch(`${INFERENCE_URL()}/v1/chat/completions`, {
    signal: controller.signal,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY()}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify({
      model:           MODEL_ID(),
      messages:        [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: strict ? userContent + '\n\nRespond with JSON only. No explanation.' : userContent },
      ],
      max_tokens:      TIER1_MAX_TOKENS,
      temperature:     0.1,
    }),
  });

  clearTimeout(timer);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gradient inference error ${res.status}: ${text}`);
  }

  const data = await res.json() as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content ?? '{}';
}

function extractJson(raw: string): string {
  // Strip markdown code fences
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  // Find first { ... } block
  const start = raw.indexOf('{');
  const end   = raw.lastIndexOf('}');
  if (start !== -1 && end !== -1) return raw.slice(start, end + 1);
  return raw.trim();
}

const EXCULPATORY_PATTERNS = [
  /no evidence\s+(that|of)\s+\w+\s*(was|were|is|are)?\s*(directly\s+)?(involved|aware|complicit|responsible)/i,
  /was not (involved|aware|responsible|complicit)/i,
  /there is no (evidence|proof|indication)/i,
  /did not (participate|know|involve|orchestrate)/i,
  /not (directly\s+)?implicated/i,
  /victim of (the|a|this)/i,
  /committed against (the entity|them|him|her)/i,
  /without (the entity's|their|his|her) knowledge/i,
  /allegations? (were|was) (dropped|dismissed|withdrawn|not proven)/i,
];

// Phrases indicating verified wrongdoing that legitimately warrants a below-5 score.
// If these are also present, the exculpatory nudge does not apply.
const CULPATORY_PATTERNS = [
  /convicted|conviction|pled guilty|guilty plea/i,
  /settlement|settled|agreed to pay/i,
  /regulatory finding|fined by|sanctioned by/i,
  /documented (pattern|history) of/i,
  /admitted (to|that)/i,
];

function scoreNudge(score: number, justification: string): number {
  if (score >= 5) return score;
  const hasExculpatory = EXCULPATORY_PATTERNS.some((p) => p.test(justification));
  if (!hasExculpatory) return score;
  const hasVerifiedWrongdoing = CULPATORY_PATTERNS.some((p) => p.test(justification));
  // Both present: nudge up by 1 (don't fully override — wrongdoing still matters)
  if (hasVerifiedWrongdoing) return Math.min(score + 1, 5);
  // Only exculpatory: floor to neutral
  return 5;
}

function parseScores(raw: string): LLMScoreResult | null {
  try {
    const parsed = JSON.parse(extractJson(raw)) as Record<string, unknown>;
    const result = {} as LLMScoreResult;

    for (const dim of DIMENSIONS) {
      const d = parsed[dim] as { score?: unknown; justification?: unknown } | undefined;
      let score = Number(d?.score);
      if (!d || isNaN(score) || score < 1 || score > 10) return null;
      const justification = String(d.justification ?? 'No justification provided.');

      result[dim] = {
        score:         Math.round(scoreNudge(score, justification)),
        justification,
      };
    }
    return result;
  } catch {
    return null;
  }
}

export async function scoreEntity(
  entityName: string,
  entityType: string,
  evidence:   EvidenceMap
): Promise<Omit<ScorePayload, 'entity_id' | 'entity_name' | 'entity_type' | 'tier'>> {
  const evidenceText = DIMENSIONS.map((dim) => {
    const text = evidence[dim] ?? 'No evidence retrieved.';
    return `### ${dim.toUpperCase()}\n${text}`;
  }).join('\n\n');

  const userContent = `Entity: ${entityName} (${entityType})\n\n${evidenceText}`;

  const start = Date.now();
  let raw = '';
  let scores: LLMScoreResult | null = null;

  try {
    raw    = await callInference(userContent, false);
    scores = parseScores(raw);

    if (!scores) {
      console.warn(`[LLM] Parse failed on attempt 1 (${raw.length} chars), retrying`);
      raw    = await callInference(userContent, true);
      scores = parseScores(raw);
      if (!scores) console.warn(`[LLM] Parse failed on attempt 2 (${raw.length} chars)`);
    }
  } catch (err) {
    console.error(`[LLM] Inference error after ${Date.now() - start}ms:`, err instanceof Error ? err.message : String(err));
  }

  if (!scores) {
    console.warn(`[LLM] Using fallback scores`);
    scores = Object.fromEntries(DIMENSIONS.map((d) => [d, FALLBACK_DIMENSION])) as LLMScoreResult;
  } else {
    console.log(`[LLM] Scored in ${Date.now() - start}ms`);
  }

  return scores;
}

export async function classifySubject(headline: string): Promise<string | null> {
  try {
    const raw = await callInference(
      `In one word or short phrase, what person, company, or product is this article primarily about? If none, reply exactly: none\n\nHeadline: "${headline}"`,
      true
    );
    const parsed = JSON.parse(raw) as { subject?: string } | string;
    const subject = typeof parsed === 'string'
      ? parsed.trim()
      : (parsed as { subject?: string }).subject?.trim() ?? '';
    return subject.toLowerCase() === 'none' || !subject ? null : subject;
  } catch {
    return null;
  }
}
