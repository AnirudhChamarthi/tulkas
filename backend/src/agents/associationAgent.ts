import { braveSearch } from '../search/braveSearch';
import { callLLMRaw } from './llmClient';

export interface AssociationResult {
  penalty:   number;
  summary:   string;
}

const SEVERITY_PENALTY: Record<string, number> = {
  low:    1,
  medium: 2,
  high:   3,
};

function detectSeverity(snippet: string): 'low' | 'medium' | 'high' | null {
  const s = snippet.toLowerCase();
  if (s.includes('murder') || s.includes('trafficking') || s.includes('genocide') || s.includes('rape')) return 'high';
  if (s.includes('fraud') || s.includes('convicted') || s.includes('sentenced') || s.includes('embezzl')) return 'medium';
  if (s.includes('arrested') || s.includes('charged') || s.includes('indicted') || s.includes('guilty')) return 'low';
  return null;
}

/**
 * Ask the LLM whether the entity has a documented, knowing association
 * with a convicted criminal — not just co-occurrence in search results.
 */
async function verifyAssociation(entityName: string, snippets: string[]): Promise<boolean> {
  const evidence = snippets.map((s, i) => `[${i + 1}] ${s}`).join('\n');
  const prompt = `You are a strict fact-checker. Based ONLY on the evidence below, answer whether "${entityName}" has a documented, knowing, voluntary personal relationship with a specific named individual who was convicted of a serious crime — meaning they met, socialised, did business with, or maintained contact with that convicted person.

Do NOT trigger if ANY of the following apply:
- The entity merely mentions, describes, or comments on convicted criminals without a personal relationship
- A third party committed a crime and the entity appears in the same article for unrelated reasons
- The entity is speaking about a group (e.g. "convicted prisoners") in a policy or political context
- A student, employee, or subordinate was convicted and the entity is their institution or employer
- The entity is a victim of the crime, or the criminal's conduct was directed against the entity (e.g. someone leaked the entity's private information, defrauded the entity, or committed a crime that harmed the entity)
- The entity is a witness, reporting party, or complainant

The association must be a real personal relationship with a specific convicted individual, not a rhetorical or political reference to criminals in general.

Evidence:
${evidence}

Reply with JSON only: { "associated": true/false, "reason": "<one sentence>" }`;

  try {
    const raw = await callLLMRaw(prompt);
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return false;
    const parsed = JSON.parse(match[0]) as { associated?: boolean };
    return parsed.associated === true;
  } catch {
    return false;
  }
}

export async function runAssociationPhase1(entityName: string): Promise<AssociationResult> {
  const results = await braveSearch(`"${entityName}" associate criminal convicted`, 5);

  if (results.length === 0) {
    return { penalty: 0, summary: 'No criminal associations found.' };
  }

  let highestSeverity: 'low' | 'medium' | 'high' | null = null;
  const flaggedSnippets: string[] = [];

  for (const r of results) {
    const severity = detectSeverity(r.snippet);
    if (!severity) continue;
    flaggedSnippets.push(r.snippet.slice(0, 300));
    if (!highestSeverity) {
      highestSeverity = severity;
    } else {
      const order = ['low', 'medium', 'high'];
      if (order.indexOf(severity) > order.indexOf(highestSeverity)) highestSeverity = severity;
    }
  }

  if (!highestSeverity || flaggedSnippets.length === 0) {
    return { penalty: 0, summary: 'No qualifying criminal associations found.' };
  }

  // LLM verification gate — prevents false positives from co-occurrence
  const confirmed = await verifyAssociation(entityName, flaggedSnippets);
  if (!confirmed) {
    return { penalty: 0, summary: 'No verified criminal associations found.' };
  }

  const penalty = SEVERITY_PENALTY[highestSeverity];
  const summary = `Gate 1 triggered (severity: ${highestSeverity}). Conduct penalty: -${penalty}. Evidence: ${flaggedSnippets[0] ?? ''}`;

  return { penalty, summary };
}
