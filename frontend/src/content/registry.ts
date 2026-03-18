import { PageType } from '../shared/types';

interface RegistryEntry {
  pattern:    RegExp;
  type:       PageType;
  entityType: 'person' | 'org';
  /** Platform name for home-page scoring (e.g. Amazon, Wikipedia, X) */
  platform:   string;
  /** True if this URL is the main/home page — score platform, not content */
  isMainPage: (url: URL) => boolean;
  /** Extract entity from content page URL (person, org, product subject) */
  extractName?: (url: URL) => string | null;
}

const REGISTRY: RegistryEntry[] = [
  {
    pattern:    /amazon\.[a-z.]+\//i,
    type:       'marketplace-product',
    entityType: 'org',
    platform:   'Amazon',
    isMainPage: (u) => !(/\/dp\//i.test(u.pathname) || /\/gp\/product\//i.test(u.pathname)),
  },
  {
    pattern:    /([a-z]+\.)?wikipedia\.org\/wiki\//i,
    type:       'informational-wikipedia',
    entityType: 'person',
    platform:   'Wikipedia',
    isMainPage: (u) => /^\/wiki\/(Main_Page|Wikipedia)?$/i.test(u.pathname.replace(/\/$/, '')) || u.pathname === '/wiki/',
    extractName: (url) => {
      const slug = url.pathname.replace(/^\/wiki\//, '').replace(/\/$/, '');
      if (!slug || slug.includes(':') || /^Main_Page$/i.test(slug)) return null;
      return decodeURIComponent(slug).replace(/_/g, ' ');
    },
  },
  {
    pattern:    /britannica\.com\//i,
    type:       'informational-encyclopedia',
    entityType: 'person',
    platform:   'Britannica',
    isMainPage: (u) => u.pathname === '/' || u.pathname === '',
    extractName: (url) => {
      const parts = url.pathname.split('/').filter(Boolean);
      const slug  = parts[parts.length - 1];
      return slug ? decodeURIComponent(slug).replace(/-/g, ' ') : null;
    },
  },
  {
    pattern:    /linkedin\.com\/in\//i,
    type:       'person',
    entityType: 'person',
    platform:   'LinkedIn',
    isMainPage: () => false,
    extractName: (url) => {
      const parts = url.pathname.split('/').filter(Boolean);
      const slug = parts[1] ?? null;
      if (!slug) return null;
      // LinkedIn profile slugs often end with numeric IDs; keep words, drop noisy tail.
      const decoded = decodeURIComponent(slug).replace(/-/g, ' ');
      return decoded.replace(/\s+\d{3,}\s*$/g, '').trim() || decoded.trim();
    },
  },
  {
    pattern:    /linkedin\.com\/company\//i,
    type:       'org',
    entityType: 'org',
    platform:   'LinkedIn',
    isMainPage: () => false,
    extractName: (url) => {
      const parts = url.pathname.split('/').filter(Boolean);
      const slug  = parts[parts.length - 1];
      if (!slug) return null;
      const decoded = decodeURIComponent(slug).replace(/-/g, ' ');
      return decoded.replace(/\s+\d{3,}\s*$/g, '').trim() || decoded.trim();
    },
  },
  {
    pattern:    /forbes\.com\/profile\//i,
    type:       'person',
    entityType: 'person',
    platform:   'Forbes',
    isMainPage: () => false,
    extractName: (url) => {
      const parts = url.pathname.split('/').filter(Boolean);
      const slug  = parts[parts.length - 1];
      return slug ? decodeURIComponent(slug).replace(/-/g, ' ') : null;
    },
  },
  {
    pattern:    /crunchbase\.com\/organization\//i,
    type:       'org',
    entityType: 'org',
    platform:   'Crunchbase',
    isMainPage: () => false,
    extractName: (url) => {
      const parts = url.pathname.split('/').filter(Boolean);
      const slug  = parts[parts.length - 1];
      return slug ? decodeURIComponent(slug).replace(/-/g, ' ') : null;
    },
  },
  {
    pattern:    /imdb\.com\/name\//i,
    type:       'person',
    entityType: 'person',
    platform:   'IMDb',
    isMainPage: () => false,
  },
  {
    pattern:    /(x|twitter)\.com\//i,
    type:       'person',
    entityType: 'person',
    platform:   'X',
    isMainPage: (u) => {
      const path = u.pathname.replace(/\/$/, '') || '/';
      return path === '/' || /^\/(home|explore|search|notifications|messages|compose)\/?$/i.test(path);
    },
    extractName: (url) => {
      const path = url.pathname.replace(/^\//, '').replace(/\/$/, '');
      const parts = path.split('/');
      if (parts[0] && !/^(home|explore|search|notifications|messages|compose|i)$/i.test(parts[0])) {
        return parts[0];
      }
      return null;
    },
  },
  {
    pattern:    /instagram\.com\//i,
    type:       'person',
    entityType: 'person',
    platform:   'Instagram',
    isMainPage: (u) => {
      const path = u.pathname.replace(/\/$/, '') || '/';
      return path === '/' || path === '';
    },
    extractName: (url) => {
      const parts = url.pathname.split('/').filter(Boolean);
      return parts[0] ?? null;
    },
  },
  {
    pattern:    /facebook\.com\//i,
    type:       'person',
    entityType: 'person',
    platform:   'Facebook',
    isMainPage: (u) => {
      const path = u.pathname.replace(/\/$/, '') || '/';
      return path === '/' || path === '' || /^\/(?:\?|$)/.test(path);
    },
    extractName: (url) => {
      if (url.pathname.startsWith('/profile.php')) return null;
      const m = url.pathname.match(/^\/([^/]+)\/?$/);
      return m ? m[1] : null;
    },
  },
  {
    pattern:    /reddit\.com\/user\//i,
    type:       'person',
    entityType: 'person',
    platform:   'Reddit',
    isMainPage: () => false,
    extractName: (url) => {
      const m = url.pathname.match(/^\/user\/([^/]+)\/?$/);
      return m ? m[1] : null;
    },
  },
  {
    pattern:    /reddit\.com\//i,
    type:       'org',
    entityType: 'org',
    platform:   'Reddit',
    isMainPage: (u) => {
      const path = u.pathname.replace(/\/$/, '') || '/';
      return path === '/' || path === '';
    },
    extractName: (url) => {
      const m = url.pathname.match(/^\/r\/([^/]+)\/?$/);
      return m ? `r/${m[1]}` : null;
    },
  },
];

export interface RegistryMatch {
  type:       PageType;
  entityType: 'person' | 'org';
  name:       string | null;
  platform:   string;
  isMainPage: boolean;
}

/**
 * Hostname fragments for 30 major online marketplaces / retailers.
 * Used by the content script to trigger DOM-retry logic on product pages where
 * brand data is injected asynchronously.
 */
export const MARKETPLACE_HOSTS: ReadonlyMap<string, string> = new Map([
  ['amazon.',          'Amazon'],
  ['alibaba.com',      'Alibaba'],
  ['aliexpress.com',   'AliExpress'],
  ['ebay.',            'eBay'],
  ['walmart.com',      'Walmart'],
  ['target.com',       'Target'],
  ['bestbuy.com',      'Best Buy'],
  ['barnesandnoble.com', 'Barnes & Noble'],
  ['etsy.com',         'Etsy'],
  ['wayfair.com',      'Wayfair'],
  ['newegg.com',       'Newegg'],
  ['homedepot.com',    'Home Depot'],
  ['lowes.com',        "Lowe's"],
  ['costco.com',       'Costco'],
  ['samsclub.com',     "Sam's Club"],
  ['overstock.com',    'Overstock'],
  ['nordstrom.com',    'Nordstrom'],
  ['macys.com',        "Macy's"],
  ['zappos.com',       'Zappos'],
  ['chewy.com',        'Chewy'],
  ['bhphotovideo.com', 'B&H Photo'],
  ['sephora.com',      'Sephora'],
  ['ulta.com',         'Ulta'],
  ['gamestop.com',     'GameStop'],
  ['rakuten.',         'Rakuten'],
  ['mercadolibre.',    'Mercado Libre'],
  ['flipkart.com',     'Flipkart'],
  ['jd.com',           'JD.com'],
  ['shopee.',          'Shopee'],
  ['temu.com',         'Temu'],
]);

/** Check whether a hostname belongs to a known marketplace. */
export function isMarketplaceHost(hostname: string): string | null {
  const h = hostname.toLowerCase();
  for (const [fragment, name] of MARKETPLACE_HOSTS) {
    if (h.includes(fragment)) return name;
  }
  return null;
}

export function matchRegistry(href: string): RegistryMatch | null {
  let url: URL;
  try { url = new URL(href); } catch { return null; }

  for (const entry of REGISTRY) {
    if (entry.pattern.test(href)) {
      const isMain = entry.isMainPage(url);
      return {
        type:       entry.type,
        entityType: entry.entityType,
        name:       isMain ? null : (entry.extractName ? entry.extractName(url) : null),
        platform:   entry.platform,
        isMainPage: isMain,
      };
    }
  }
  return null;
}
