export const addNote = (note) => ({
  type: 'NOTE_ADD',
  note: note
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
