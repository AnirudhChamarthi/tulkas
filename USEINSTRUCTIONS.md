# How to Use Tulkas

Tulkas is a browser extension that scores the ethical track record of people, companies, and organisations you encounter online. It works automatically on supported sites and lets you search for any entity manually.

---

## Installation

### Chrome

1. **Download or clone** this repository.
2. Open a terminal in the `frontend/` folder and install dependencies:
   ```
   npm install
   ```
3. Build the Chrome extension:
   ```
   npm run build:chrome
   ```
4. Open Chrome and navigate to `chrome://extensions/`.
5. Enable **Developer mode** (toggle in the top-right corner).
6. Click **Load unpacked** and select the `frontend/dist/chrome` folder.
7. Pin the Tulkas icon in the toolbar by clicking the puzzle-piece icon and pressing the pin next to Tulkas.

### Firefox

1. Follow steps 1–2 above, then build for Firefox:
   ```
   npm run build:firefox
   ```
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on** and select any file inside `frontend/dist/firefox` (e.g. `manifest.json`).

> **Note:** Temporary add-ons in Firefox are removed when the browser closes. For persistent installation, the extension must be signed via Mozilla Add-ons.

---

## Using the Extension

### Automatic Detection

When you visit a supported page, Tulkas automatically detects the relevant entity:

| Site type | What gets scored |
|-----------|-----------------|
| **Wikipedia / Britannica** | The article subject |
| **Amazon / eBay / Walmart** and 27 other marketplaces | The product brand or manufacturer (not the marketplace itself) |
| **LinkedIn profiles** | The person or company |
| **X (Twitter) / Instagram / Facebook** | The account owner (resolved to real name if known) |
| **Forbes / Crunchbase / IMDb** | The profiled person or company |
| **Any other site** | Tulkas reads Schema.org metadata or the site name |

Click the Tulkas icon to see the scorecard. Scores are displayed across six dimensions:

- **Environment** — ecological impact
- **Labour** — worker treatment and supply chains
- **Corruption** — fraud, bribery, conflicts of interest
- **Political** — civil liberties, policy impact, state violence
- **Community** — philanthropy, education, public health
- **Conduct** — personal behaviour and integrity

Each dimension is scored 1–10 with a justification citing specific sources.

### Manual Search

If Tulkas doesn't detect an entity automatically, or if you want to look up someone specific:

1. Click the Tulkas icon.
2. The popup shows a search box when no entity is detected (or click the search icon to switch to manual mode).
3. Type a name (e.g. "Elon Musk", "Nestlé") and press Enter.
4. Tulkas will return a Tier 1 score within about 15–20 seconds.

### Advanced Search (Tier 2)

For a deeper analysis:

1. After receiving a Tier 1 score, click the **Advanced Search** button in the popup.
2. Tulkas runs a multi-step research agent that takes up to 3 minutes.
3. The popup polls for progress automatically. When complete, the scorecard updates with Tier 2 scores and longer justifications.

### Reload / Refresh

- Click the **reload icon** (circular arrow) in the top-right of the popup to re-detect the current page and clear the local cache for this entity.
- This is useful after navigating to a new page within the same tab, or if the initial detection picked the wrong entity.

---

## What Tulkas Does NOT Score

Tulkas is designed for **specific, accountable entities** — individual people and named organisations.

It will not score:
- Countries or nations (e.g. "Israel", "France")
- Religions or denominations (e.g. "Islam", "Christianity")
- Ethnic groups or nationalities (e.g. "Kurds", "Americans")
- Demographic groups or movements (e.g. "Gen Z", "Liberals")
- Abstract concepts (e.g. "Capitalism", "Democracy")

If you navigate to a page about a broad public group, Tulkas will show a message explaining it cannot score that subject and offer the manual search box instead.

---

## Running the Backend Locally (Development)

If you want to run the full stack locally:

1. **Prerequisites:** Node.js 20+, a DigitalOcean account with Managed Postgres, Managed Valkey, and Spaces configured, a Gradient AI API key, and a Brave Search API key.

2. Create a `.env` file in the project root with all required variables (see `DO.md` for the full list):
   ```
   DATABASE_URL=postgresql://...
   REDIS_URL=rediss://...
   GRADIENT_API_KEY=...
   GRADIENT_INFERENCE_URL=https://inference.do-ai.run
   GRADIENT_MODEL_ID=anthropic-claude-haiku-4.5
   GRADIENT_KB_ID=...
   BRAVE_SEARCH_KEY=...
   SPACES_ENDPOINT=https://...digitaloceanspaces.com
   SPACES_KEY=...
   SPACES_SECRET=...
   ```

3. Install and start the backend:
   ```
   cd backend
   npm install
   npm run dev
   ```
   You should see `Redis connected`, `Postgres connected`, and `Tulkas API listening on port 8081`.

4. In a second terminal, build the frontend with the local backend URL:
   ```
   cd frontend
   npm install
   npm run build:chrome
   ```

5. Load the extension in Chrome as described above. It will connect to `http://localhost:8081`.

---

## Flushing the Cache

To clear all cached scores from Valkey:

```
cd backend
npm run flush:valkey
```

This requires `REDIS_URL` to be set in your environment. The cache is also flushed automatically on every push to `main` via the GitHub Actions workflow (`.github/workflows/flush-valkey.yml`).

---

## Disclaimer

Tulkas is a research helper, not a total source of truth. Scores are generated by AI based on publicly available information and may contain errors. Always do your own research.
