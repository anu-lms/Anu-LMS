export const notebookOpened = () => ({
  type: 'LESSON_NOTEBOOK_OPENED'
});

export const notebookClosed = () => ({
  type: 'LESSON_NOTEBOOK_CLOSED'
});

export const setActiveNote = note => ({
  type: 'LESSON_NOTEBOOK_SET_NOTE',
  note,
});
