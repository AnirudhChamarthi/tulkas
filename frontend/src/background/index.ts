import { Message, PageContext, ScorePayload } from '../shared/types';
import { POLL_INTERVAL_MS, POLL_MAX_ATTEMPTS } from '../shared/constants';
import { getCached, setCached } from './localCache';
import { fetchScore, fetchAdvancedScore, pollJobStatus, resolveHandle, resolveEntityAI } from './apiClient';

const tabContext   = new Map<number, PageContext>();
const tabScore     = new Map<number, ScorePayload>();
const tabActiveJob = new Map<number, string>();

let pendingReload: { tabId: number; resolve: (r: { context: PageContext | null; score: ScorePayload | null }) => void } | null = null;

// Wipe stale per-tab state the moment a new page starts loading so the popup
// never briefly shows the previous page's entity while the new one loads.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    tabContext.delete(tabId);
    tabScore.delete(tabId);
    // Keep tabActiveJob: a deep-research job survives page navigation so the
    // user can reopen the popup on the new page and still see it completing.
  }
});

// ── Helpers ────────────────────────────────────────────────────────────────────

async function resolveScore(entity: string, entityType: string): Promise<ScorePayload> {
  const cached = await getCached(entity);
  if (cached) return cached;
  const score = await fetchScore(entity, entityType);
  await setCached(entity, score);
  return score;
}

function sendToPopup(tabId: number, msg: Message): void {
  chrome.runtime.sendMessage(msg).catch(() => {
    // Popup may not be open — silently ignore
  });
  void tabId; // tabId reserved for future tab-targeted messaging
}

async function startPolling(
  tabId:      number,
  jobId:      string,
  entity:     string,
): Promise<void> {
  tabActiveJob.set(tabId, jobId);
  let attempts = 0;
  const interval = setInterval(async () => {
    attempts++;
    try {
      const status = await pollJobStatus(jobId);
      sendToPopup(tabId, { type: 'ADVANCED_UPDATE', jobId, status });

      if (status.status === 'complete' && status.score) {
        await setCached(entity, status.score, 2);
        tabScore.set(tabId, status.score);
        tabActiveJob.delete(tabId);
        clearInterval(interval);
      } else if (status.status === 'failed') {
        tabActiveJob.delete(tabId);
        clearInterval(interval);
      } else if (attempts >= POLL_MAX_ATTEMPTS) {
        // Frontend polling limit reached — the backend job may still be running.
        // Stop this interval but keep tabActiveJob so the popup can resume
        // polling when it next opens.
        clearInterval(interval);
      }
    } catch {
      if (attempts >= POLL_MAX_ATTEMPTS) {
        clearInterval(interval);
      }
    }
  }, POLL_INTERVAL_MS);
}

// ── Message handler ────────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((msg: Message, sender, sendResponse) => {
  const tabId = sender.tab?.id ?? -1;

  if (msg.type === 'PAGE_CONTEXT') {
    const ctx = msg.context;
    tabContext.set(tabId, ctx);
    if (pendingReload?.tabId === tabId) {
      pendingReload.resolve({ context: ctx, score: null });
    }
    const { primaryEntity, primaryEntityType, resolveHandle: needsResolve, platform } = ctx;

    // Notify popup to refresh when this tab is active (same-tab navigation)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id === tabId) {
        sendToPopup(tabId, { type: 'PAGE_CHANGED' });
      }
    });

    if (primaryEntity) {
      const doFetch = (entity: string, entityType: string) => {
        resolveScore(entity, entityType)
          .then((score) => {
            tabScore.set(tabId, score);
            sendToPopup(tabId, { type: 'SCORE_READY', score, entity });
          })
          .catch((err) => {
            const msg = err instanceof Error ? err.message : String(err);
            if (/does not score public groups of people/i.test(msg)) {
              // Switch to manual/unknown view and show the scope disclaimer.
              const updated: PageContext = {
                ...ctx,
                type: 'unknown',
                primaryEntity: '',
                confidence: 'low',
                resolveHandle: false,
                resolveEntity: false,
              };
              tabContext.set(tabId, updated);
              sendToPopup(tabId, { type: 'CONTEXT_READY', context: updated });
              return;
            }
            console.error(err);
          });
      };

      const maybeResolveSocial = async () => {
        if (needsResolve && platform) {
          try {
            const resolved = await resolveHandle(primaryEntity, platform);
            const updated = { ...ctx, primaryEntity: resolved, resolveHandle: false };
            tabContext.set(tabId, updated);
            sendToPopup(tabId, { type: 'CONTEXT_READY', context: updated });
            return { entity: resolved, entityType: primaryEntityType };
          } catch {
            return { entity: primaryEntity, entityType: primaryEntityType };
          }
        }
        return { entity: primaryEntity, entityType: primaryEntityType };
      };

      const maybeResolveAI = async (base: { entity: string; entityType: string }) => {
        if (!ctx.resolveEntity) return base;
        try {
          const r = await resolveEntityAI(ctx.sourceUrl, ctx.pageTitle, ctx.candidates);
          const resolvedName = (r.entity ?? '').trim();
          if (!resolvedName) return base;
          const updated: PageContext = {
            ...ctx,
            primaryEntity:     resolvedName,
            primaryEntityType: r.entityType ?? (base.entityType as 'person' | 'org'),
            resolveEntity:     false,
          };
          tabContext.set(tabId, updated);
          sendToPopup(tabId, { type: 'CONTEXT_READY', context: updated });
          return { entity: resolvedName, entityType: updated.primaryEntityType };
        } catch {
          return base;
        }
      };

      maybeResolveSocial()
        .then(maybeResolveAI)
        .then(({ entity, entityType }) => doFetch(entity, entityType))
        .catch(() => doFetch(primaryEntity, primaryEntityType));
    }
    sendResponse({ ok: true });
    return true;
  }

  if (msg.type === 'GET_SCORE') {
    // sender.tab is undefined when the message comes from the popup (not a tab),
    // so we must query the active tab to find the right context/score.
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeId   = tabs[0]?.id ?? -1;
      const ctx        = tabContext.get(activeId);
      const score      = tabScore.get(activeId);
      const activeJobId = tabActiveJob.get(activeId) ?? null;
      sendResponse({ context: ctx ?? null, score: score ?? null, activeJobId });
    });
    return true; // async
  }

  if (msg.type === 'REQUEST_ADVANCED') {
    const { entity, entityType, note } = msg;
    // Popup has no tab ID — resolve active tab for polling notifications
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeId = tabs[0]?.id ?? -1;
      fetchAdvancedScore(entity, entityType, note)
        .then(({ job_id }) => {
          sendResponse({ job_id });
          startPolling(activeId, job_id, entity).catch(console.error);
        })
        .catch((err) => {
          console.error('[Background] Advanced request failed:', err);
          sendResponse({ error: String(err) });
        });
    });
    return true;
  }

  if (msg.type === 'FETCH_SCORE') {
    const { entity, entityType } = msg;
    fetchScore(entity, entityType)
      .then((score) => sendResponse({ score }))
      .catch((err) => {
        console.error('[Background] FETCH_SCORE failed:', err);
        sendResponse({ error: String(err) });
      });
    return true;
  }

  if (msg.type === 'RESOLVE_ENTITY') {
    const { url, title, candidates } = msg;
    resolveEntityAI(url, title, candidates)
      .then((r) => sendResponse(r))
      .catch((err) => {
        console.error('[Background] RESOLVE_ENTITY failed:', err);
        sendResponse({ error: String(err) });
      });
    return true;
  }

  if (msg.type === 'TULKAS_RELOAD') {
    // Clear entire local score cache so stale scores from previous backend
    // deployments don't survive the reload.
    chrome.storage.local.get(null, (items) => {
      const staleKeys = Object.keys(items).filter((k) => k.startsWith('tulkas_score_'));
      if (staleKeys.length > 0) chrome.storage.local.remove(staleKeys);
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id ?? -1;
      tabContext.delete(tabId);
      tabScore.delete(tabId);
      tabActiveJob.delete(tabId);
      const finish = (r: { context: PageContext | null; score: ScorePayload | null }) => {
        if (pendingReload?.tabId === tabId) {
          pendingReload = null;
          sendResponse(r);
        }
      };
      pendingReload = { tabId, resolve: finish };
      setTimeout(() => finish({ context: null, score: null }), 5000);
      chrome.tabs.sendMessage(tabId, { type: 'TULKAS_RELOAD' }).catch(() => finish({ context: null, score: null }));
    });
    return true;
  }

  return false;
});
