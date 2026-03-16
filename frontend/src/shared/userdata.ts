const noteKey = (entityId: string) => `tulkas_note_${entityId}`;

export async function loadNote(entityId: string): Promise<string> {
  try {
    const result = await chrome.storage.sync.get(noteKey(entityId));
    return (result[noteKey(entityId)] as string) ?? '';
  } catch {
    return '';
  }
}

export async function saveNote(entityId: string, note: string): Promise<void> {
  try {
    await chrome.storage.sync.set({ [noteKey(entityId)]: note });
  } catch {
    await chrome.storage.local.set({ [noteKey(entityId)]: note });
  }
}
