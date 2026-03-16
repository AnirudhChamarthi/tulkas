import { PageType } from '../shared/types';

interface SchemaResult {
  type:       PageType;
  entityType: 'person' | 'org';
  name:       string | null;
  brand?:     string;   // for Product pages
}

type JsonLdBlock = Record<string, unknown>;

function parseBlock(block: JsonLdBlock): SchemaResult | null {
  const t = (block['@type'] as string | string[] | undefined);
  const types = Array.isArray(t) ? t : t ? [t] : [];

  // Product → marketplace-product (dual score: Amazon + brand)
  if (types.some((x) => x === 'Product')) {
    const name  = (block['name'] as string | undefined) ?? null;
    const brand = (block['brand'] as { name?: string } | undefined)?.name ?? undefined;
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
      const blocks: JsonLdBlock[] = Array.isArray(json) ? json : [json];
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
