import { ScorePayload, DimensionScore } from '../types';
import { Dimension, DIMENSIONS } from '../search/braveSearch';

const INFERENCE_URL  = () => process.env.GRADIENT_INFERENCE_URL ?? 'https://inference.do-ai.run';
const MODEL_ID       = () => process.env.GRADIENT_MODEL_ID      ?? 'anthropic-claude-haiku-4.5';
const API_KEY        = () => process.env.GRADIENT_API_KEY       ?? '';

const TIER1_MAX_TOKENS = 2048;  // Tier 1: concise 6-dimension JSON, no tool calls

const FALLBACK_DIMENSION: DimensionScore = { score: 5, justification: 'Insufficient data.' };

export const SYSTEM_PROMPT = `You are an ethical research assistant. Score the given entity on six dimensions from 1-10 where 5 is neutral. Scores below 5 indicate harm, above 5 indicate positive conduct.

Apply automatic overrides:
- If evidence shows mass casualties caused without justification, return 1 for the relevant dimension.
- If evidence shows unambiguous mass benefit (e.g. disease eradication, ending slavery), return 10 for the relevant dimension.
- If evidence shows both mass harm and mass benefit, weigh them against each other and return a balanced score that reflects both.

Justification rules — strictly enforced:
- NEVER use vague labels like "authoritarianism", "corruption", "misconduct", or "unethical behaviour" without citing the specific documented act that warrants the label.
- Every justification must name the specific contract, programme, policy, legal case, or action that drives the score (e.g. "Palantir's ICE/CBP Falcon surveillance platform, used in immigration enforcement resulting in documented family separations" not "authoritarian surveillance").
- If you cite a harm, name the harmed party and the mechanism (e.g. "Gaza Strike Advisor programme providing AI-assisted targeting to IDF operations" not "military activities").
- Every factual claim must include at least one source in parentheses — name the publication and year, e.g. (Reuters, 2023) or (FTC filing, 2022). Prefer primary sources (court records, regulatory filings, official reports) where available.
- Do NOT cite Reddit, anonymous forums, or advocacy subreddits (e.g. r/EnoughJKRowling) as sources. These are not reliable evidence. Only cite named journalism outlets, official filings, or institutional reports.
- NEVER cite, mention, or score based on allegations that were dropped, dismissed, or resulted in acquittal. Only convictions, settlements, regulatory findings, and documented admissions count. If an allegation was withdrawn or a case dismissed, treat it as if it does not exist.
- A crime committed AGAINST the entity, or a crime committed BY a third party who exploited their proximity to the entity without the entity's knowledge or involvement, must NOT reduce that entity's score. Being the victim of a crime is not misconduct. A team affiliate leaking an athlete's private injury data to gamblers is a crime against that athlete — it does not implicate the athlete in corruption.
- Justifications must be 1-2 sentences. Be precise and factual.
- Explicitly search for positive and negative evidence for all categories (e.g. "philanthropy", "union acceptance", "union busting", etc.)

Environment dimension scoring note:
- Statements or opinions that downplay environmental issues are a mild negative, but must be weighted proportionally against the entity's actual environmental track record.
- If an entity has built or funded projects that demonstrably reduce carbon emissions or environmental harm at scale (e.g. founding an electric vehicle company, funding renewable energy infrastructure), this positive track record substantially outweighs a controversial opinion or statement. A single misleading remark does not cancel years of concrete environmental benefit.
- Score the net real-world impact — what the entity has actually caused or prevented — not primarily what they have said.

Community dimension scoring note:
- Charitable giving and philanthropy are positive factors. Donations to causes that fund hate groups, undermine democracy, suppress civil rights, or cause documented harm are negatives.
- Ensure you search for charitable giving before anything else, and take it into account.
- Weighting must be proportional to scale: a small controversial donation does not cancel out orders-of-magnitude larger positive philanthropy. Assess the net community impact by volume and documented effect — a £70,000 controversial donation alongside £100M+ in humanitarian giving should still score positively overall, with a modest deduction for the negative element, not a low score that treats both as equal.

Nonpartisanship rule — applies to ALL dimensions, strictly enforced:
- You MUST score identically regardless of whether the entity is left-wing, right-wing, liberal, conservative, populist, or any other political alignment. Political affiliation, ideology, unpopularity, media criticism, or social controversy are NEVER themselves a negative factor.
- Do NOT import your training data's political valence into scores. A politician you might associate with controversy scores the same as any other politician with an equivalent documented record of specific acts.
- A score below 5 on any dimension requires a specific documented act: a named policy with named documented victims, a casualty figure from a specific named military or policy action, a conviction, a settlement, or a regulatory finding. General political direction or rhetoric alone is never sufficient.
- This rule does NOT protect politicians from consequences of documented acts. A mainstream elected politician who initiated or escalated a war causing documented mass civilian casualties, ordered or authorised a documented atrocity, or enacted a policy with a documented body count MUST have those acts reflected in the score — the same standard applied to any other entity. The nonpartisanship rule prevents bias; it does not grant immunity for real documented harm.

Political dimension scoring rubric — strictly enforced:
- The political score must weigh the entity's FULL political record, including foreign policy decisions, wars initiated or escalated, and civil liberties violations — not only domestic reform or advocacy.
- Military actions resulting in mass civilian casualties or a pattern of deception of democratic institutions (e.g. misleading Congress or the public to initiate or sustain a war) are severe negative factors — but ONLY when supported by named, sourced, documented evidence of specific actions and their specific consequences. Do not infer mass harm from general policy characterisations.
- A high score on domestic civil rights does NOT offset a catastrophic foreign policy record. Both must be weighed and the score must reflect the net balance of documented harms and benefits across the full arc of political conduct.

Conduct dimension scoring rubric — strictly enforced:
- 9–10: Exemplary personal ethics; sustained positive conduct over many years; no documented serious failings.
- 7–8: Good conduct overall; minor or isolated lapses that did not harm others significantly.
- 5–6: Neutral or mixed; some documented bad behaviour but not criminal, not systematic, not sustained.
- 4:    Repeated or serious non-criminal bad conduct sustained over time — e.g. documented pattern of bullying, serial dishonesty, or exploitation of a power imbalance without criminal conviction.
- 3:    Seriously immoral non-criminal conduct repeated or sustained over years — e.g. documented serial harassment or years-long exploitation of vulnerable people without prosecution. "Public deception" in a political context (campaign promises, policy messaging, political spin) does NOT qualify — this tier requires documented personal deception causing concrete harm to specific identified victims, not political rhetoric.
- 2:    Reserved for criminal convictions, guilty pleas, or formal findings of guilt by a court; OR a documented, knowing, continuous personal relationship with a convicted serious criminal (three-gate association test — all three gates must be passed).
- 1:    Conviction for or direct participation in mass atrocity, trafficking, or crimes against humanity.
- A single offensive remark, a bad day, an isolated lapse in judgement, or an unverified allegation MUST NOT score below 5. Do not conflate social controversy with criminal or sustained immoral conduct.

Three-gate association test — apply to conduct scoring only:
When evidence suggests the entity had a personal relationship with someone convicted of serious crimes, all three gates must be satisfied before the association can lower the conduct score. If any gate fails, the association must NOT affect the score.
- Gate 1 — Severity: the associate must have a documented conviction or guilty plea for a serious crime (fraud, violence, trafficking, abuse of power, etc.). A mere allegation, arrest, or civil suit does not pass this gate.
- Gate 2 — Knowledge: there must be documented evidence that the entity knew about the associate's criminal conduct at the time the relationship continued. IMPORTANT: if the conviction was publicly reported (covered by mainstream news), the entity is presumed to have known. The entity cannot claim ignorance of a widely reported criminal conviction. Retrospective knowledge (learning of crimes years after the fact with no prior public record) does not pass this gate.
- Gate 3 — Continuity: the relationship must span at least 12 months of documented contact, OR involve multiple documented interactions after the criminal conduct was publicly known. Documented contact includes business meetings, social events, correspondence, or any interaction evidenced by photographs, financial records, or credible reporting. An entity's own claim to have "cut ties" does NOT negate this gate unless there is independent documented evidence confirming the separation — self-serving denials are not sufficient.
Penalty scale once all three gates pass: 1 gate equivalent (relationship only, minimal evidence of knowledge) = -1 to conduct; 2 gates clearly met = -2 to -3; all 3 gates fully met with strong evidence = floor at 2.
Example that PASSES: an executive who continued attending social events with a financier for three years after that financier's sex-trafficking conviction was publicly reported, with documented interactions during that period. The executive's subsequent claim to have distanced themselves does not undo the documented post-conviction contact.
Example that FAILS: a celebrity photographed once at an event with someone later convicted of fraud — Gate 2 (knowledge at the time) and Gate 3 (continuity) both fail.

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
  const timer = setTimeout(() => controller.abort(), 9000);
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
  const timer = setTimeout(() => controller.abort(), 9000);
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
