import { detectPage } from './detector';
import { Message } from '../shared/types';

function sendContext() {
  const context = detectPage();
  chrome.runtime.sendMessage({ type: 'PAGE_CONTEXT', context } satisfies Message);
}

sendContext();

// Back/forward: page is restored from bfcache, content script doesn't re-run
window.addEventListener('pageshow', (e) => {
  const fromBfcache = e.persisted ||
    (typeof performance !== 'undefined' && (performance.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming)?.type === 'back_forward');
  if (fromBfcache) sendContext();
});

chrome.runtime.onMessage.addListener((msg: Message) => {
  if (msg.type === 'TULKAS_RELOAD') sendContext();
});
