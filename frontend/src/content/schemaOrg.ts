import { PageType } from '../shared/types';

interface SchemaResult {
  type:       PageType;
  entityType: 'person' | 'org';
  name:       string | null;
  brand?:     string;   // for Product pages
}

type JsonLdBlock = Record<string, unknown>;

function getString(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function extractNameField(v: unknown): string | null {
  // common JSON-LD shape: { name: "X" } or { name: { "@value": "X" } }
  if (!v || typeof v !== 'object') return null;
  const obj = v as Record<string, unknown>;
  const direct = getString(obj.name);
  if (direct) return direct;
  const nameObj = obj.name;
  if (nameObj && typeof nameObj === 'object') {
    const value = getString((nameObj as Record<string, unknown>)['@value']);
    if (value) return value;
  }
  return null;
}

function extractBrandLike(v: unknown): string | null {
  // brand/manufacturer can be: "Vaseline", {name:"Vaseline"}, [{name:"Vaseline"}], etc.
  const s = getString(v);
  if (s) return s;

  if (Array.isArray(v)) {
    for (const item of v) {
      const name = extractBrandLike(item);
      if (name) return name;
    }
    return null;
  }

  if (v && typeof v === 'object') {
    // Try standard name extraction on the object itself
    const byName = extractNameField(v);
    if (byName) return byName;

    // Some sites nest brand like { brand: { name: "X" } }
    const nested = (v as Record<string, unknown>).brand;
    const nestedName = extractBrandLike(nested);
    if (nestedName) return nestedName;
  }

  return null;
}

function flattenJsonLd(json: unknown): JsonLdBlock[] {
  const out: JsonLdBlock[] = [];
  const queue: unknown[] = Array.isArray(json) ? [...json] : [json];

  while (queue.length) {
    const cur = queue.shift();
    if (!cur || typeof cur !== 'object') continue;

    if (Array.isArray(cur)) {
      queue.push(...cur);
      continue;
    }

    out.push(cur as JsonLdBlock);

    const graph = (cur as Record<string, unknown>)['@graph'];
    if (Array.isArray(graph)) queue.push(...graph);
  }

  return out;
}

function parseBlock(block: JsonLdBlock): SchemaResult | null {
  const t = (block['@type'] as string | string[] | undefined);
  const types = Array.isArray(t) ? t : t ? [t] : [];

  // Product → marketplace-product (dual score: Amazon + brand)
  if (types.some((x) => x === 'Product')) {
    const name  = (block['name'] as string | undefined) ?? null;
    const brand =
      extractBrandLike(block['brand']) ??
      extractBrandLike(block['manufacturer']) ??
      // Sometimes seller/merchant is present instead of brand; still better than "Amazon".
      extractBrandLike((block['offers'] as Record<string, unknown> | undefined)?.seller) ??
      undefined;
    return { type: 'marketplace-product', entityType: 'org', name, brand };
  }

  // Person
  if (types.some((x) => x === 'Person')) {
    return {
      type:       'person',
      entityType: 'person',
      name:       (block['name'] as string | undefined) ?? null,
    };
  }

  // Organisation variants
  if (types.some((x) => ['Organization', 'Corporation', 'LocalBusiness', 'Company'].includes(x))) {
    return {
      type:       'org',
      entityType: 'org',
      name:       (block['name'] as string | undefined) ?? null,
    };
  }

  // WebSite → treat as a branded organisation (lower-priority than article types)
  if (types.some((x) => x === 'WebSite')) {
    const name = (block['name'] as string | undefined) ?? null;
    if (name) return { type: 'org', entityType: 'org', name };
  }

  // NewsArticle / Article → informational-article
  if (types.some((x) => ['NewsArticle', 'Article', 'BlogPosting'].includes(x))) {
    const headline = (block['headline'] as string | undefined) ?? null;
    return { type: 'informational-article', entityType: 'person', name: headline };
  }

  return null;
}

export function parseSchemaOrg(): SchemaResult | null {
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  for (const script of scripts) {
    try {
      const json = JSON.parse(script.textContent ?? '');
      const blocks = flattenJsonLd(json);
      for (const block of blocks) {
        const result = parseBlock(block);
        if (result) return result;
      }
    } catch {
      // malformed JSON-LD — skip
    }
  }
  return null;
}
