# Tulkas — Browser Extension

Preact + TypeScript browser extension. Works in both Chrome and Firefox.

## Stack

- **Framework**: Preact (lightweight React-compatible)
- **Language**: TypeScript
- **Bundler**: Vite + @crxjs/vite-plugin
- **Manifest**: MV3 (separate chrome/firefox manifests merged at build time)
- **Storage**: `chrome.storage.sync` (notes, weights — never sent to server)

## What it does

Detects the type of page the user is on, fetches an ethical scorecard from the
backend API, and displays six dimension scores (1–10) in a popup.

## Page types handled

| Page type | Behaviour |
|---|---|
| Person (`linkedin.com/in/`, `forbes.com/profile/`) | Single scorecard |
| Organisation (company website, `linkedin.com/company/`) | Single scorecard |
| Marketplace product (`amazon.com/dp/`) | Dual tab: store + brand |
| Wikipedia article | Info banner + subject score |
| News article | Extracts primary subject, shows their score |
| Unknown | Search bar pre-focused |

## Structure

```
src/
├── background/
│   ├── index.ts          ← MV3 service worker
│   ├── apiClient.ts      ← All HTTP calls to backend
│   └── localCache.ts     ← chrome.storage.local score cache
├── content/
│   ├── index.ts          ← Injected into all pages
│   ├── detector.ts       ← Page type + entity detection pipeline
│   ├── registry.ts       ← Hardcoded URL pattern map
│   └── schemaOrg.ts      ← ld+json parsing
├── popup/
│   ├── index.html
│   ├── App.tsx           ← Root component
│   ├── Scorecard.tsx     ← Six-dimension score display
│   ├── DualView.tsx      ← Tab switcher for marketplace pages
│   ├── InfoBanner.tsx    ← Wikipedia/informational banner
│   ├── Commentary.tsx    ← 100-char user note (local only)
│   ├── AdvancedButton.tsx← Triggers Tier 2 scoring
│   ├── PrioritiesPanel.tsx← Collapsible dimension weights
│   └── scoreUtils.ts     ← Weighted overall calculation
└── shared/
    ├── types.ts          ← All TypeScript interfaces
    ├── constants.ts      ← BACKEND_URL and other constants
    ├── messaging.ts      ← Typed message bus helpers
    ├── weights.ts        ← Weight storage helpers
    └── userdata.ts       ← Note load/save (chrome.storage.sync)
```

## Building

```bash
npm install
npm run dev            # Vite dev mode (for popup development)
npm run build:chrome   # Produces dist/chrome.zip
npm run build:firefox  # Produces dist/firefox.zip
```

## Loading unpacked (development)

**Chrome**: `chrome://extensions` → Enable Developer Mode → Load Unpacked → select `dist/chrome/`

**Firefox**: `about:debugging` → This Firefox → Load Temporary Add-on → select `dist/firefox/manifest.json`

## User data privacy

- Notes and dimension weights are stored only in `chrome.storage.sync`
- Nothing is sent to the backend except the entity name and type
- Notes are included in Advanced scoring requests transiently and never persisted server-side
