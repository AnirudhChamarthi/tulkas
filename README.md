# Tulkas

Tulkas is a browser extension that scores the ethical track record of people, companies, and organisations you encounter online. It works on Chrome and Firefox, detecting entities automatically on major websites and letting you search for anyone manually.

Scores are generated across six dimensions — Environment, Labour, Corruption, Political, Community, and Conduct — each rated 1–10 with cited justifications. A fast Tier 1 score is available in seconds; an optional Tier 2 deep-research mode runs a multi-step AI agent for more detailed analysis.

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-org/tulkas.git
cd tulkas

# Build the Chrome extension
cd frontend
npm install
npm run build:chrome

# Load frontend/dist/chrome as an unpacked extension in chrome://extensions/
```

For full setup instructions, including Firefox and local backend development, see **[USEINSTRUCTIONS.md](USEINSTRUCTIONS.md)**.

---

## How It Works

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────────┐
│  Browser     │     │  Background  │     │  Backend             │
│  Content     │────>│  Service     │────>│  (App Platform)      │
│  Script      │     │  Worker      │     │                      │
│              │     │              │     │  Redis ──> Postgres   │
│  Detects     │     │  Resolves    │     │    │         │        │
│  entity on   │     │  entity &    │     │    ▼         ▼        │
│  page        │     │  fetches     │     │  Brave ──> Gradient   │
│              │     │  scores      │     │  Search     LLM       │
└─────────────┘     └──────────────┘     └──────────────────────┘
```

1. **Content script** detects the entity on the current page (Wikipedia subject, Amazon product brand, social profile, etc.).
2. **Background service worker** sends the entity to the backend and caches results locally.
3. **Backend** checks Valkey cache, then Postgres, then runs a live scoring pipeline: Brave Search for evidence, Gradient Knowledge Base for recalled passages, and Gradient Inference for the final scored output.
4. **Popup** displays the scorecard with dimension breakdowns and justifications.

---

## Project Structure

```
tulkas/
├── frontend/                 # Browser extension (Preact + TypeScript + Vite)
│   ├── src/
│   │   ├── content/          # Content script: entity detection, Schema.org, retry
│   │   ├── background/       # Service worker: API calls, caching, message routing
│   │   ├── popup/            # Popup UI: scorecard, manual search, advanced button
│   │   └── shared/           # Types, constants, weights
│   ├── .env.chrome            # Production backend URL for Chrome build
│   └── .env.firefox           # Production backend URL for Firefox build
│
├── backend/                  # Scoring API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── api/              # Routes: /score, /score/advanced, /score/resolve
│   │   ├── agents/           # LLM client, Tier 1 scorer, Tier 2 agent, association logic
│   │   ├── cache/            # Valkey/Redis client
│   │   ├── db/               # Postgres client, entity lookup, score mapping
│   │   ├── search/           # Brave Search, Gradient Knowledge Base
│   │   └── storage/          # DigitalOcean Spaces (evidence blobs)
│   └── scripts/
│       └── flush-valkey.js   # Cache flush utility
│
├── infra/
│   └── db/
│       └── seed.sql          # Curated entity scores for Postgres
│
├── .github/
│   └── workflows/
│       └── flush-valkey.yml  # Auto-flush cache on push to main
│
├── DO.md                     # DigitalOcean & Gradient AI integration details
├── USEINSTRUCTIONS.md        # Download, install, and usage guide
└── README.md                 # This file
```

---

## Scoring Dimensions

| Dimension | What it measures |
|-----------|-----------------|
| **Environment** | Ecological impact: emissions, conservation, large projects |
| **Labour** | Worker treatment, supply chains, wages, union relations |
| **Corruption** | Fraud, bribery, conflicts of interest, regulatory findings |
| **Political** | Civil liberties, policy impact, war/peace, state violence |
| **Community** | Philanthropy, education, public health, hate-group ties |
| **Conduct** | Personal behaviour, integrity, patterns of abuse or restraint |

Scores range from 1 (severe documented harm) to 10 (sustained documented benefit), with 5 as neutral. Every score includes a justification citing specific sources.

---

## Infrastructure

Tulkas runs on DigitalOcean and Gradient AI:

- **App Platform** — hosts the backend API
- **Managed Postgres** — stores curated entity scores
- **Managed Valkey** — caches live scores, job state, and classification results
- **Spaces** — persists raw evidence text
- **Gradient Inference** — LLM scoring and entity classification
- **Gradient Knowledge Base** — evidence recall from indexed passages
- **Gradient ADK Agent** — Tier 2 deep multi-step research
- **Brave Search** — web evidence gathering

For a detailed breakdown of every integration point, environment variable, and data flow, see **[DO.md](DO.md)**.

---

## Marketplace Support

Tulkas detects product brands on 30 major online stores, including Amazon, eBay, Walmart, Target, Best Buy, Alibaba, AliExpress, Etsy, Wayfair, Newegg, Home Depot, Lowe's, Costco, Nordstrom, Macy's, Sephora, Temu, and more. On Amazon, brand names are extracted directly from the URL slug for instant detection without waiting for page scripts to load.

---

## Scope & Limitations

Tulkas scores **specific, accountable entities** — individual people and named organisations. It does not score countries, religions, ethnic groups, or other broad public categories.

Tulkas is a research helper, not a total source of truth. Scores are AI-generated from publicly available information and may contain errors. Always do your own research.

---

## License

See [LICENSE](LICENSE) for details.
