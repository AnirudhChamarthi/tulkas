import { PageContext } from '../shared/types';
import { matchRegistry } from './registry';
import { parseSchemaOrg } from './schemaOrg';

function titleFallback(): string {
  return document.title
    .split(/[-|–—]/)[0]
    .trim()
    .slice(0, 100);
}

function isWikipediaDisambiguation(): boolean {
  return (
    location.href.includes('_(disambiguation)') ||
    !!document.querySelector('.dmbox')
  );
}

function isWikipediaList(): boolean {
  return /\/wiki\/List_of_/i.test(location.href);
}

function detectCorporateSite(): { name: string; confidence: 'high' | 'medium' | 'low' } | null {
  const ogSiteName = document
    .querySelector('meta[property="og:site_name"]')
    ?.getAttribute('content')
    ?.trim();
  if (ogSiteName) return { name: ogSiteName, confidence: 'high' };

  const appName = document
    .querySelector('meta[name="application-name"]')
    ?.getAttribute('content')
    ?.trim();
  if (appName) return { name: appName, confidence: 'medium' };

  const pathDepth = location.pathname.replace(/\/$/, '').split('/').filter(Boolean).length;
  if (pathDepth === 0) {
    const host  = location.hostname.replace(/^www\./, '');
    const label = host
      .split('.')[0]
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    if (label) return { name: label, confidence: 'low' };
  }

  return null;
}

/** Try page metadata for display name (og:title, title) — avoids AI call */
function getDisplayNameFromPage(): string | null {
  const og = document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim();
  if (og) {
    const m = og.match(/^([^(]+?)(?:\s*\(@?\w+\))?\s*[|/]/);
    if (m) return m[1].trim();
    if (!og.includes('@')) return og;
  }
  return null;
}

export function detectPage(): PageContext {
  const href = location.href;
  const reg = matchRegistry(href);

  if (reg) {
    if (reg.isMainPage) {
      return {
        type:              reg.type,
        primaryEntity:     reg.platform,
        primaryEntityType: 'org',
        sourceUrl:         href,
        confidence:        'high',
      };
    }

    if (reg.type === 'marketplace-product') {
      const schema = parseSchemaOrg();
      const brand  = schema?.brand ?? schema?.name ?? null;
      return {
        type:              'marketplace-product',
        primaryEntity:     brand || 'Amazon',
        primaryEntityType: 'org',
        sourceUrl:         href,
        confidence:        brand ? 'high' : 'medium',
      };
    }

    if (reg.type === 'informational-wikipedia') {
      if (isWikipediaList()) {
        return { type: 'unknown', primaryEntity: '', primaryEntityType: 'person', sourceUrl: href, confidence: 'low' };
      }
      if (isWikipediaDisambiguation()) {
        return {
          type:              'unknown',
          primaryEntity:     reg.name ?? titleFallback(),
          primaryEntityType: 'person',
          sourceUrl:         href,
          confidence:        'low',
        };
      }
      if (reg.name) {
        return {
          type:              reg.type,
          primaryEntity:     reg.name,
          primaryEntityType: reg.entityType,
          sourceUrl:         href,
          confidence:        'high',
        };
      }
    }

    if (reg.type === 'informational-encyclopedia' && reg.name) {
      return {
        type:              reg.type,
        primaryEntity:     reg.name,
        primaryEntityType: reg.entityType,
        sourceUrl:         href,
        confidence:        'high',
      };
    }

    const socialPlatforms = ['X', 'Instagram', 'Facebook', 'Reddit'];
    if (socialPlatforms.includes(reg.platform) && reg.name) {
      const displayName = getDisplayNameFromPage();
      return {
        type:              reg.type,
        primaryEntity:     displayName || reg.name,
        primaryEntityType: reg.entityType,
        sourceUrl:         href,
        confidence:        displayName ? 'high' : 'medium',
        platform:          reg.platform,
        resolveHandle:     !displayName,
      };
    }

    if (reg.name) {
      return {
        type:              reg.type,
        primaryEntity:     reg.name,
        primaryEntityType: reg.entityType,
        sourceUrl:         href,
        confidence:        'high',
      };
    }
  }

  const schema = parseSchemaOrg();
  if (schema?.name) {
    if (schema.type === 'marketplace-product') {
      const brand = schema.brand ?? schema.name;
      return {
        type:              'marketplace-product',
        primaryEntity:     brand || 'Amazon',
        primaryEntityType: 'org',
        sourceUrl:         href,
        confidence:        'medium',
      };
    }
    return {
      type:              schema.type,
      primaryEntity:     schema.name,
      primaryEntityType: schema.entityType,
      sourceUrl:         href,
      confidence:        'medium',
    };
  }

  const corp = detectCorporateSite();
  if (corp) {
    return {
      type:              'org',
      primaryEntity:     corp.name,
      primaryEntityType: 'org',
      sourceUrl:         href,
      confidence:        corp.confidence,
    };
  }

  if (reg) {
    return {
      type:              reg.type,
      primaryEntity:     titleFallback(),
      primaryEntityType: reg.entityType,
      sourceUrl:         href,
      confidence:        'low',
    };
  }

  return {
    type:              'unknown',
    primaryEntity:     '',
    primaryEntityType: 'person',
    sourceUrl:         href,
    confidence:        'low',
  };
}
