import { useState, useEffect, useRef } from 'preact/hooks';
import { JobStatus, Message } from '../shared/types';

function friendlyError(raw: string): string {
  if (/failed to fetch|networkerror|network error/i.test(raw)) {
    return 'Could not reach the server.';
  }
  if (/api 4\d\d|api 5\d\d/i.test(raw)) {
    return 'Server error.';
  }
  return raw;
}

interface Props {
  entity:       string;
  entityType:   string;
  note?:        string;
  onComplete:   (status: JobStatus) => void;
  /** Restore polling for an already-running job (e.g. popup was closed mid-research) */
  initialJobId?: string | null;
  /** If the displayed score is already tier 2, start the button in 'done' state */
  scoreTier?:   1 | 2;
}

type Phase = 'idle' | 'loading' | 'polling' | 'done' | 'failed';

export function AdvancedButton({ entity, entityType, note, onComplete, initialJobId, scoreTier }: Props) {
  const [phase, setPhase] = useState<Phase>(() => {
    if (scoreTier === 2)   return 'done';
    if (initialJobId)      return 'polling';
    return 'idle';
  });
  const [jobId, setJobId] = useState<string | null>(initialJobId ?? null);
  const [error, setError] = useState<string | null>(null);

  const [pollingStart, setPollingStart] = useState<number | null>(
    initialJobId ? Date.now() : null
  );
  const [, setTick] = useState(0);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (phase !== 'polling') {
      setPollingStart(null);
      return;
    }
    setPollingStart((t) => t ?? Date.now());
    const id = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, [phase]);

  function startResearch() {
    setPhase('loading');
    setJobId(null);
    setError(null);

    chrome.runtime.sendMessage(
      { type: 'REQUEST_ADVANCED', entity, entityType, note } satisfies Message,
      (res: { job_id?: string; error?: string }) => {
        if (res?.job_id) {
          setJobId(res.job_id);
          setPhase('polling');
        } else {
          setError(friendlyError(res?.error ?? 'Unknown error'));
          setPhase('failed');
        }
      }
    );
  }

  function handleClick() {
    if (phase === 'idle' || phase === 'failed') {
      startResearch();
    }
  }

  function handleCancel() {
    chrome.runtime.sendMessage(
      { type: 'CANCEL_ADVANCED', entity, entityType } satisfies Message,
    );
    setJobId(null);
    setPhase('idle');
  }

  useEffect(() => {
    if (phase !== 'polling' || !jobId) return;

    function listener(msg: Message) {
      if (msg.type !== 'ADVANCED_UPDATE' || msg.jobId !== jobId) return;
      if (msg.status.status === 'complete') {
        setPhase('done');
        onCompleteRef.current(msg.status);
      } else if (msg.status.status === 'failed') {
        setPhase('failed');
      }
    }

    chrome.runtime.onMessage.addListener(listener);
    return () => chrome.runtime.onMessage.removeListener(listener);
  }, [phase, jobId]); // eslint-disable-line react-hooks/exhaustive-deps

  function elapsedLabel(): string {
    if (!pollingStart) return '';
    const s   = Math.floor((Date.now() - pollingStart) / 1000);
    const min = Math.floor(s / 60);
    const sec = String(s % 60).padStart(2, '0');
    return ` (${min}:${sec})`;
  }

  const labels: Record<Phase, string> = {
    idle:    'Deep Research',
    loading: 'Requesting…',
    polling: `Researching…${elapsedLabel()}`,
    done:    'Research complete',
    failed:  'Failed — retry',
  };

  return (
    <div class="advanced-btn-wrap">
      <button
        class={`advanced-btn phase-${phase}`}
        onClick={handleClick}
        disabled={phase === 'loading' || phase === 'polling' || phase === 'done'}
        title="Run deep multi-source research (1–2 minutes)"
      >
        {phase === 'polling' && <span class="spinner" />}
        {labels[phase]}
      </button>
      {phase === 'polling' && (
        <button
          class="advanced-btn-cancel"
          onClick={handleCancel}
          title="Cancel and re-run with a new note"
        >
          Cancel
        </button>
      )}
      {phase === 'failed' && error && (
        <p class="advanced-btn-error" title={error}>{error}</p>
      )}
    </div>
  );
}
