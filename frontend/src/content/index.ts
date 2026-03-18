import { detectPage } from './detector';
import { isMarketplaceHost } from './registry';
import { Message, PageContext } from '../shared/types';

function sendContext(ctx?: PageContext) {
  const context = ctx ?? detectPage();
  chrome.runtime.sendMessage({ type: 'PAGE_CONTEXT', context } satisfies Message);
  return context;
}

const RETRY_DELAYS = [800, 1500, 3000];

function sendWithRetry() {
  const first = sendContext();

  const marketplace = isMarketplaceHost(location.hostname);
  if (!marketplace) return;

  const fellBack = first.primaryEntity === marketplace || first.primaryEntity === '' || first.confidence === 'low';
  if (!fellBack) return;

  let attempt = 0;
  const tryAgain = () => {
    if (attempt >= RETRY_DELAYS.length) return;
    const delay = RETRY_DELAYS[attempt];
    attempt++;
    setTimeout(() => {
      const updated = detectPage();
      const improved =
        updated.primaryEntity !== marketplace &&
        updated.primaryEntity !== '' &&
        updated.primaryEntity !== first.primaryEntity;
      if (improved) {
        sendContext(updated);
      } else {
        tryAgain();
      }
    }, delay);
  };
  tryAgain();
}

sendWithRetry();

// Back/forward: page is restored from bfcache, content script doesn't re-run
window.addEventListener('pageshow', (e) => {
  const fromBfcache = e.persisted ||
    (typeof performance !== 'undefined' && (performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming)?.type === 'back_forward');
  if (fromBfcache) sendWithRetry();
});

chrome.runtime.onMessage.addListener((msg: Message) => {
  if (msg.type === 'TULKAS_RELOAD') sendWithRetry();
});
