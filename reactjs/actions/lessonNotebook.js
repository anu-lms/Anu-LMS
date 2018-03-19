export const notebookOpened = () => ({
  type: 'LESSON_NOTEBOOK_OPENED'
});

export const notebookClosed = () => ({
  type: 'LESSON_NOTEBOOK_CLOSED'
});

export const setActiveNote = noteId => ({
  type: 'LESSON_NOTEBOOK_SET_ACTIVE_NOTE',
  noteId,
});
