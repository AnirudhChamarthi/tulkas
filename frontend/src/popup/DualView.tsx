import { useState } from 'preact/hooks';
import { ScorePayload, DimensionWeights, JobStatus } from '../shared/types';
import { Scorecard } from './Scorecard';
import { AdvancedButton } from './AdvancedButton';
import { Commentary } from './Commentary';
import { PrioritiesPanel } from './PrioritiesPanel';

interface Props {
  primary:             { name: string; score: ScorePayload | null; loading: boolean };
  secondary:           { name: string; score: ScorePayload | null; loading: boolean } | null;
  weights:             DimensionWeights;
  onWeightsChange:     (w: DimensionWeights) => void;
  showReasonsDefault?: boolean;
  /** Job ID of an in-flight deep-research run, so AdvancedButton can resume polling */
  activeJobId?:        string | null;
  /** Show "taking longer than expected" hint when scoring is slow */
  loadingHint?:        boolean;
}

export function DualView({ primary, secondary, weights, onWeightsChange, showReasonsDefault, activeJobId, loadingHint }: Props) {
  const tabs = secondary
    ? [primary.name, secondary.name]
    : [primary.name];
  const hasSecondary = !!secondary;

  const [activeTab, setActiveTab] = useState(0);
  const safeTab = hasSecondary ? activeTab : 0;
  const [note, setNote]           = useState('');
  const [tier2Score, setTier2]    = useState<ScorePayload | null>(null);

  const active = safeTab === 0 ? primary : secondary!;
  const display = tier2Score && safeTab === 0 ? tier2Score : active.score;

  function handleAdvancedComplete(status: JobStatus) {
    if (status.score) setTier2(status.score);
  }

  return (
    <div class="dual-view">
      {tabs.length > 1 && (
        <div class="tab-bar">
          {tabs.map((t, i) => (
            <button
              key={t}
              class={`tab ${safeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div class="tab-content">
        {active.loading && (
          <>
            <p class="loading">Scoring {active.name}…</p>
            {loadingHint && (
              <p class="hint-msg">Taking longer than expected. Try reloading the page and opening Tulkas again.</p>
            )}
          </>
        )}
        {!active.loading && display && (
          <Scorecard
            score={display}
            weights={weights}
            entityName={active.name}
            tier={tier2Score ? 2 : display.tier}
            defaultShowReasons={showReasonsDefault}
          />
        )}
        {!active.loading && !display && (
          <p class="no-data">No data found for {active.name}.</p>
        )}
      </div>

      {safeTab === 0 && active.score && (
        <>
          <Commentary entityId={active.score.entity_id} onChange={setNote} />
          <AdvancedButton
            entity={active.name}
            entityType={active.score.entity_type}
            note={note}
            onComplete={handleAdvancedComplete}
            initialJobId={activeJobId ?? null}
            scoreTier={tier2Score ? 2 : active.score.tier}
          />
        </>
      )}

      <PrioritiesPanel weights={weights} onChange={onWeightsChange} />
    </div>
  );
}
