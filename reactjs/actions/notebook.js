/**
 * Adds or updates an existing note in the notebook.
 */
export const addNote = (note) => ({
  type: 'NOTE_ADD',
  note,
});

/**
 * Adds a new note to the notebook.
 * Yet unsaved.
 */
export const addNewNote = (title = '', body = '') => ({
  type: 'NOTE_ADD_NEW',
  title,
  body,
});

/**
 * Gets triggered when the new note is saved
 * and got an id from the backend.
 */
export const replaceNewNote = (note) => ({
  type: 'NOTE_REPLACE_NEW',
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
