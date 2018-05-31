/**
 * Make request to the backend to get notes.
 */
export const syncNotes = () => ({
  type: 'NOTES_REQUESTED',
});

/**
 * Request to the backend to get notes failed.
 */
export const syncNotesFailed = error => ({
  type: 'NOTES_REQUEST_FAILED',
  error,
});

/**
 * Save received from backend notes to the application store.
 */
export const receiveNotes = notes => ({
  type: 'NOTES_RECEIVED',
  notes,
});

/**
 * Adds or updates an existing note in the notebook.
 */
export const addNote = note => ({
  type: 'NOTE_ADD',
  note,
});

/**
 * Self-explanatory action.
 */
export const clear = () => ({
  type: 'NOTEBOOK_CLEAR',
});

/**
 * Set note title.
 */
export const updateNoteTitle = (id, title) => ({
  type: 'NOTE_UPDATE_TITLE',
  id,
  title,
});

/**
 * Set note body html.
 */
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

/**
 * Set note state to "Not Saved".
 */
export const setNoteStateNotSaved = id => ({
  type: 'NOTE_SET_STATE_NOT_SAVED',
  id,
});

/**
 *  Show notes list or note edit form on the mobile.
 *  This action toggles what is being shown.
 */
export const toggleMobileVisibility = () => ({
  type: 'NOTEBOOK_MOBILE_TOGGLE_VISIBILITY',
});

/**
 * Force data sync with the backend.
 */
export const saveNote = note => ({
  type: 'NOTE_SAVE',
  note,
});

/**
 * Delete specified note.
 */
export const deleteNote = id => ({
  type: 'NOTE_DELETE',
  id,
});
