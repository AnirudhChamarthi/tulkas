import { useState } from 'preact/hooks';
import { ScorePayload, DimensionWeights } from '../shared/types';
import { DIMENSIONS, DIMENSION_LABELS } from '../shared/constants';
import { computeOverall } from '../shared/weights';
import { scoreColour, scoreLabel } from './scoreUtils';

interface Props {
  score:             ScorePayload;
  weights:           DimensionWeights;
  entityName:        string;
  tier:              1 | 2;
  defaultShowReasons?: boolean;
}

export function Scorecard({ score, weights, entityName, tier, defaultShowReasons }: Props) {
  const [expanded,    setExpanded]    = useState<string | null>(null);
  const [showReasons, setShowReasons] = useState(defaultShowReasons ?? false);
  const overall = computeOverall(score, weights);

  function toggleRow(dim: string) {
    // If "show all" is active, switch to single-row mode for that dim
    if (showReasons) {
      setShowReasons(false);
      setExpanded(dim);
    } else {
      setExpanded((prev) => (prev === dim ? null : dim));
    }
  }

  const isOpen = (dim: string) => showReasons || expanded === dim;

  return (
    <div class="scorecard">
      <div class="scorecard-header">
        <span class="entity-name" title={entityName}>{entityName}</span>
        <div class="overall-badge" style={{ background: scoreColour(overall) }}>
          <span class="overall-score">{overall.toFixed(1)}</span>
          <span class="overall-label">{scoreLabel(overall)}</span>
        </div>
      </div>

      {tier === 1 && (
        <p class="tier-notice">Quick scan · <em>Deep research available</em></p>
      )}
      {tier === 2 && (
        <p class="tier-notice tier-notice--advanced">Deep research complete</p>
      )}

      <div class="reasons-toggle-row">
        <button
          class={`reasons-toggle ${showReasons ? 'active' : ''}`}
          onClick={() => { setShowReasons((v) => !v); setExpanded(null); }}
        >
          {showReasons ? '▲ Hide reasons' : '▼ Why this score?'}
        </button>
      </div>

      <div class="dimensions">
        {DIMENSIONS.map((dim) => {
          const d    = score[dim];
          const col  = scoreColour(d.score);
          const open = isOpen(dim);
          return (
            <div
              key={dim}
              class={`dim-row ${open ? 'open' : ''}`}
              onClick={() => toggleRow(dim)}
              title="Click for details"
            >
              <span class="dim-chevron">{open ? '▼' : '▶'}</span>
              <span class="dim-name">{DIMENSION_LABELS[dim]}</span>
              <div class="dim-bar-wrap">
                <div class="dim-bar" style={{ width: `${(d.score / 10) * 100}%`, background: col }} />
              </div>
              <span class="dim-score" style={{ color: col }}>{d.score}</span>
              {open && (
                <p class="dim-justification">{d.justification}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
