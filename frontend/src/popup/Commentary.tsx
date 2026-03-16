import { useState } from 'preact/hooks';
import { loadNote, saveNote } from '../shared/userdata';
import { useEffect } from 'preact/hooks';

interface Props {
  entityId: string;
  onChange: (note: string) => void;
}

export function Commentary({ entityId, onChange }: Props) {
  const [note,    setNote]    = useState('');
  const [saved,   setSaved]   = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadNote(entityId).then((n) => { setNote(n); onChange(n); });
  }, [entityId]);

  async function handleSave() {
    await saveNote(entityId, note);
    onChange(note);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div class="commentary">
      <button class="commentary-toggle" onClick={() => setVisible((v) => !v)}>
        {visible ? '▲ Hide note' : '▼ Add context note'}
      </button>
      {visible && (
        <>
          <p class="commentary-disclosure">
            Your note is included with your Deep Research request and sent to the scoring AI.
            It is not stored by Tulkas servers.
          </p>
          <textarea
            class="commentary-input"
            rows={3}
            maxLength={100}
            placeholder="Optional context (e.g. 'focus on environmental record')"
            value={note}
            onInput={(e) => setNote((e.target as HTMLTextAreaElement).value)}
          />
          <div class="commentary-footer">
            <span class="char-count">{note.length}/100</span>
            <button class="commentary-save" onClick={handleSave}>
              {saved ? 'Saved ✓' : 'Save'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
