export interface SearchResult {
  title:   string;
  url:     string;
  snippet: string;
}

const BRAVE_ENDPOINT = 'https://api.search.brave.com/res/v1/web/search';

// Domains whose content is too low-quality or biased to use as evidence
const BLOCKED_DOMAINS = ['reddit.com', 'quora.com'];

function isBlockedDomain(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return BLOCKED_DOMAINS.some((d) => host === d || host.endsWith('.' + d));
  } catch {
    return false;
  }
}

const PAYWALL_PATTERNS = [
  /subscribe\s+to\s+(read|continue|access|unlock)/i,
  /this\s+(article|content|story)\s+is\s+(for\s+)?(subscribers?|members?|premium)/i,
  /sign\s+in\s+to\s+read/i,
  /create\s+a\s+free\s+account\s+to\s+read/i,
  /you['']ve\s+(reached|hit)\s+(your\s+)?(free\s+)?(article|monthly)\s+limit/i,
  /register\s+for\s+free\s+to\s+read/i,
  /already\s+a\s+subscriber\?/i,
  /get\s+unlimited\s+access/i,
  /exclusive\s+content\s+for\s+members/i,
];

function stripPaywallText(snippet: string): string {
  for (const pattern of PAYWALL_PATTERNS) {
    if (pattern.test(snippet)) return '';
  }
  return snippet;
}
const TIMEOUT_MS     = 2000;

export async function braveSearch(
  query: string,
  count = 3
): Promise<SearchResult[]> {
  const apiKey = process.env.BRAVE_SEARCH_KEY;
  if (!apiKey) throw new Error('BRAVE_SEARCH_KEY is not set');

  const url = `${BRAVE_ENDPOINT}?q=${encodeURIComponent(query)}&count=${count}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      headers: {
        'Accept':              'application/json',
        'Accept-Encoding':     'gzip',
        'X-Subscription-Token': apiKey,
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      console.warn(`[BraveSearch] HTTP ${res.status} for query: "${query}"`);
      return [];
    }

    const data = await res.json() as {
      web?: { results?: Array<{ title: string; url: string; description?: string }> };
    };

    const results = data.web?.results ?? [];
    console.log(`[BraveSearch] "${query}" → ${results.length} results`);

    return results
      .filter((r) => !isBlockedDomain(r.url ?? ''))
      .slice(0, count)
      .map((r) => ({
        title:   r.title ?? '',
        url:     r.url   ?? '',
        snippet: stripPaywallText(r.description ?? ''),
      }))
      .filter((r) => r.snippet.length > 40);

  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.warn(`[BraveSearch] Timeout on query: "${query}"`);
    } else {
      console.warn(`[BraveSearch] Error on query: "${query}"`, err);
    }
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export const SEARCH_TEMPLATES = {
  person: {
    environment: (name: string) => `"${name}" environmental impact animal welfare`,
    labor:       (name: string) => `"${name}" labor workers rights treatment`,
    corruption:  (name: string) => `"${name}" corruption fraud bribery`,
    political:   (name: string) => `"${name}" civil rights political lobbying foreign policy war hate groups`,
    community:   (name: string) => `"${name}" charity philanthropy foundation donations controversial donations hate groups hate speech`,
    conduct:     (name: string) => `"${name}" criminal associates misconduct`,
  },
  org: {
    environment: (name: string) => `"${name}" carbon footprint environmental record contribution to reducing carbon footprint`,
    labor:       (name: string) => `"${name}" labor practices workers conditions`,
    corruption:  (name: string) => `"${name}" corruption fine regulatory violation`,
    political:   (name: string) => `"${name}" lobbying civil liberties authoritarian`,
    community:   (name: string) => `"${name}" community impact harm exploitation charitable giving foundation`,
    conduct:     (name: string) => `"${name}" executives criminal misconduct`,
  },
} as const;

export type Dimension = keyof typeof SEARCH_TEMPLATES.person;
export const DIMENSIONS: Dimension[] = ['environment', 'labor', 'corruption', 'political', 'community', 'conduct'];
