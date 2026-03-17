import { render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ScorePayload, PageContext, DimensionWeights, Message } from '../shared/types';
import { loadWeights, DEFAULT_WEIGHTS } from '../shared/weights';
import { DualView } from './DualView';

const GET_SCORE_TIMEOUT_MS = 5000;
const LOADING_HINT_DELAY_MS = 8000;

function friendlyError(raw: string): string {
  if (/failed to fetch|networkerror|network error/i.test(raw)) {
    return 'Could not reach the server. Make sure the backend is running and try reloading the page.';
  }
  if (/api 4\d\d|api 5\d\d/i.test(raw)) {
    return 'Server error. The backend may need a restart. Try again in a moment.';
  }
  if (raw.length > 80) return raw.slice(0, 77) + '…';
  return raw;
}

interface AppState {
  context:           PageContext | null;
  primaryScore:      ScorePayload | null;
  primaryLoading:    boolean;
  weights:           DimensionWeights;
  searchQuery:       string;
  searchType:        'person' | 'org';
  searchResult:      ScorePayload | null;
  searchLoading:     boolean;
  searchError:       string | null;
  activeJobId:       string | null;
  getScoreTimeout:   boolean;  // GET_SCORE never responded
  loadingHint:       boolean;  // show "taking longer than expected" after delay
  searchLoadingHint: boolean;  // show hint when search is slow
}

function App() {
  const [state, setState] = useState<AppState>({
    context:           null,
    primaryScore:      null,
    primaryLoading:    true,
    weights:           DEFAULT_WEIGHTS,
    searchQuery:       '',
    searchType:        'person',
    searchResult:      null,
    searchLoading:    false,
    searchError:       null,
    activeJobId:       null,
    getScoreTimeout:   false,
    loadingHint:       false,
    searchLoadingHint: false,
  });

  // Load persisted weights
  useEffect(() => {
    loadWeights().then((weights) => setState((s) => ({ ...s, weights })));
  }, []);

  // Ask background for current tab context + score
  useEffect(() => {
    let responded = false;

    const timeout = setTimeout(() => {
      if (responded) return;
      responded = true;
      setState((s) => ({ ...s, getScoreTimeout: true, primaryLoading: false }));
    }, GET_SCORE_TIMEOUT_MS);

    chrome.runtime.sendMessage({ type: 'GET_SCORE' } satisfies Message, (res) => {
      if (responded) return;
      responded = true;
      clearTimeout(timeout);

      if (chrome.runtime.lastError) {
        setState((s) => ({
          ...s,
          primaryLoading: false,
          getScoreTimeout: true,
        }));
        return;
      }

      if (!res?.context) {
        setState((s) => ({ ...s, primaryLoading: false }));
        return;
      }
      const ctx: PageContext        = res.context;
      const score: ScorePayload | null = res.score ?? null;
      const activeJobId: string | null = res.activeJobId ?? null;

      // If the page context is unknown but we already have a suspected entity
      // name (e.g. a Wikipedia disambiguation page), pre-fill the search form
      // and kick off the search automatically so the user doesn't have to type.
      if (ctx.type === 'unknown' && ctx.primaryEntity) {
        setState((s) => ({
          ...s,
          context:        ctx,
          primaryLoading:  false,
          searchQuery:     ctx.primaryEntity,
          searchType:      ctx.primaryEntityType,
          searchLoading:   true,
        }));
        chrome.runtime.sendMessage(
          { type: 'FETCH_SCORE', entity: ctx.primaryEntity, entityType: ctx.primaryEntityType } satisfies Message,
          (res: { score?: ScorePayload; error?: string }) => {
            if (res?.error) {
              setState((prev) => ({ ...prev, searchError: friendlyError(res.error), searchLoading: false, searchLoadingHint: false }));
            } else if (res?.score) {
              setState((prev) => ({ ...prev, searchResult: res.score!, searchLoading: false, searchLoadingHint: false }));
            }
          }
        );
        return;
      }

      setState((s) => ({
        ...s,
        context:          ctx,
        primaryScore:     score,
        primaryLoading:   score == null && !!ctx.primaryEntity,
        activeJobId,
      }));
    });

    // Listen for background score updates and same-tab navigation
    const listener = (msg: Message) => {
      if (msg.type === 'PAGE_CHANGED') {
        chrome.runtime.sendMessage({ type: 'GET_SCORE' } satisfies Message, (res: { context?: PageContext | null; score?: ScorePayload | null; activeJobId?: string | null }) => {
          if (chrome.runtime.lastError || !res) return;
          if (res.context) {
            setState((s) => ({
              ...s,
              context: res.context!,
              primaryScore: res.score ?? null,
              primaryLoading: !res.score && !!res.context?.primaryEntity,
              activeJobId: res.activeJobId ?? null,
              getScoreTimeout: false,
            }));
          } else {
            setState((s) => ({ ...s, context: null, primaryScore: null, primaryLoading: false }));
          }
        });
      }
      if (msg.type === 'CONTEXT_READY') {
        setState((s) => ({ ...s, context: msg.context }));
      }
      if (msg.type === 'SCORE_READY') {
        setState((s) =>
          msg.entity === s.context?.primaryEntity
            ? { ...s, primaryScore: msg.score, primaryLoading: false, loadingHint: false }
            : s
        );
      }
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
      clearTimeout(timeout);
    };
  }, []);

  // Show "taking longer than expected" hint when primaryLoading or searchLoading is stuck
  useEffect(() => {
    if (!state.primaryLoading && !state.searchLoading) return;
    const id = setTimeout(() => {
      setState((s) => ({
        ...s,
        loadingHint: s.primaryLoading || s.loadingHint,
        searchLoadingHint: s.searchLoading || s.searchLoadingHint,
      }));
    }, LOADING_HINT_DELAY_MS);
    return () => clearTimeout(id);
  }, [state.primaryLoading, state.searchLoading]);

  function handleSearch(e: Event) {
    e.preventDefault();
    const q = state.searchQuery.trim();
    if (!q) return;
    setState((s) => ({ ...s, searchLoading: true, searchResult: null, searchError: null }));

    chrome.runtime.sendMessage(
      { type: 'FETCH_SCORE', entity: q, entityType: state.searchType } satisfies Message,
      (res: { score?: ScorePayload; error?: string }) => {
        if (chrome.runtime.lastError) {
          setState((s) => ({ ...s, searchError: friendlyError(chrome.runtime.lastError.message), searchLoading: false }));
          return;
        }
        if (res?.error) {
          setState((s) => ({ ...s, searchError: friendlyError(res.error), searchLoading: false, searchLoadingHint: false }));
          return;
        }
        if (res?.score) {
          setState((s) => ({ ...s, searchResult: res.score!, searchLoading: false }));
        }
      }
    );
  }

  const { context, primaryScore, primaryLoading, weights, activeJobId, getScoreTimeout, loadingHint, searchLoadingHint } = state;

  function handleReload() {
    setState((s) => ({ ...s, primaryLoading: true, getScoreTimeout: false }));
    chrome.runtime.sendMessage({ type: 'TULKAS_RELOAD' } satisfies Message, (res: { context?: PageContext | null; score?: ScorePayload | null }) => {
      if (res?.context) {
        setState((s) => ({
          ...s,
          context: res.context!,
          primaryScore: res.score ?? null,
          primaryLoading: !res.score && !!res.context?.primaryEntity,
        }));
      } else {
        setState((s) => ({ ...s, primaryLoading: false }));
      }
    });
  }

  // ── Manual search panel (unknown page or fallback) ──────────────────────────
  if (!context?.primaryEntity || context.type === 'unknown') {
    return (
      <div class="app">
        <header class="app-header">
          <img src="../icons/icon48.png" alt="" class="app-logo" />
          <span class="app-title">Tulkas</span>
          <button type="button" class="reload-btn" onClick={handleReload} title="Reload Tulkas">↻</button>
        </header>
        <p class="hint-msg">
          Tulkas does not score public groups of people. It is designed for specific people and organisations only.
        </p>
        {getScoreTimeout && (
          <p class="hint-msg hint-msg--warning">
            Tulkas may need a reload. Try closing this popup and opening it again, or reload the page.
          </p>
        )}
        <form class="search-form" onSubmit={handleSearch}>
          <input
            class="search-input"
            type="text"
            placeholder="Search person or company…"
            value={state.searchQuery}
            onInput={(e) => setState((s) => ({
              ...s, searchQuery: (e.target as HTMLInputElement).value
            }))}
          />
          <div class="search-type-row">
            <label>
              <input
                type="radio" name="stype" value="person"
                checked={state.searchType === 'person'}
                onChange={() => setState((s) => ({ ...s, searchType: 'person' }))}
              /> Person
            </label>
            <label>
              <input
                type="radio" name="stype" value="org"
                checked={state.searchType === 'org'}
                onChange={() => setState((s) => ({ ...s, searchType: 'org' }))}
              /> Company
            </label>
          </div>
          <button type="submit" class="search-submit" disabled={state.searchLoading}>
            {state.searchLoading ? 'Searching…' : 'Search'}
          </button>
        </form>
        {searchLoadingHint && state.searchLoading && (
          <p class="hint-msg">Taking longer than expected. The server may be slow or unreachable — try reloading the page.</p>
        )}
        {state.searchError && <p class="error-msg">{state.searchError}</p>}
        {state.searchResult && (
          <DualView
            primary={{ name: state.searchResult.entity_name, score: state.searchResult, loading: false }}
            secondary={null}
            weights={weights}
            onWeightsChange={(w) => setState((s) => ({ ...s, weights: w }))}
            showReasonsDefault={true}
          />
        )}
        <footer class="app-footer">
          <p class="disclaimer">Tulkas does not score public groups of people.</p>
          <p class="disclaimer">Tulkas can be wrong - it is a helper, not a total source of truth. Please do your own research.</p>
        </footer>
      </div>
    );
  }

  // ── Detected page ────────────────────────────────────────────────────────────
  return (
    <div class="app">
      <header class="app-header">
        <img src="../icons/icon48.png" alt="" class="app-logo" />
        <span class="app-title">Tulkas</span>
        <button type="button" class="reload-btn" onClick={handleReload} title="Reload Tulkas">↻</button>
      </header>
      <DualView
        primary={{ name: context.primaryEntity, score: primaryScore, loading: primaryLoading }}
        secondary={null}
        weights={weights}
        onWeightsChange={(w) => setState((s) => ({ ...s, weights: w }))}
        activeJobId={activeJobId}
        loadingHint={loadingHint}
      />
      <footer class="app-footer">
        <p class="disclaimer">Tulkas does not score public groups of people.</p>
        <p class="disclaimer">Tulkas can be wrong - it is a helper, not a total source of truth. Please do your own research.</p>
      </footer>
    </div>
  );
}

render(<App />, document.getElementById('root')!);
