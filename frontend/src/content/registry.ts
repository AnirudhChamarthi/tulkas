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
      return parts[1] ?? null;
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
      return slug ? decodeURIComponent(slug).replace(/-/g, ' ') : null;
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
