import { DimensionWeights } from '../shared/types';
import { DIMENSIONS, DIMENSION_LABELS } from '../shared/constants';
import { saveWeights } from '../shared/weights';
import { useState } from 'preact/hooks';

interface Props {
  weights:   DimensionWeights;
  onChange:  (w: DimensionWeights) => void;
}

export function PrioritiesPanel({ weights, onChange }: Props) {
  const [open, setOpen] = useState(false);

  function update(dim: keyof DimensionWeights, val: number) {
    const next = { ...weights, [dim]: val as 1 | 2 | 3 | 4 | 5 };
    saveWeights(next).catch(console.error);
    onChange(next);
  }

  return (
    <div class="priorities">
      <button class="priorities-toggle" onClick={() => setOpen((v) => !v)}>
        {open ? '▲ Hide priorities' : '▼ My priorities'}
      </button>
      {open && (
        <div class="priorities-grid">
          {DIMENSIONS.map((dim) => (
            <div key={dim} class="priority-row">
              <label class="priority-label">{DIMENSION_LABELS[dim]}</label>
              <input
                type="range"
                min={1} max={5} step={1}
                value={weights[dim]}
                class="priority-slider"
                onInput={(e) => update(dim, Number((e.target as HTMLInputElement).value))}
              />
              <span class="priority-val">{weights[dim]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
