/**
 * Adds or updates an existing note in the notebook.
 */
export const addNote = (note) => ({
  type: 'NOTE_ADD',
  note,
});

export const clear = () => ({
  type: 'NOTEBOOK_CLEAR',
});

export const updateNoteTitle = (id, title) => ({
  type: 'NOTE_UPDATE_TITLE',
  id,
  title,
});

export const updateNoteBody = (id, body) => ({
  type: 'NOTE_UPDATE_BODY',
  id,
  body,
});

/**
 * Set note for editing.
 */
export const setActiveNote = id => ({
  type: 'NOTE_SET_ACTIVE',
  id,
});

/**
 * Set note state to "Is Saving".
 */
export const setNoteStateSaving = id => ({
  type: 'NOTE_SET_STATE_SAVING',
  id,
});

/**
 * Set note state to "Is Saving".
 */
export const setNoteStateSaved = id => ({
  type: 'NOTE_SET_STATE_SAVED',
  id,
});
