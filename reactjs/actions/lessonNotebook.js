export const open = () => ({
  type: 'LESSON_NOTEBOOK_OPEN'
});

export const close = () => ({
  type: 'LESSON_NOTEBOOK_CLOSE'
});

export const setActiveNote = noteId => ({
  type: 'LESSON_NOTEBOOK_SET_ACTIVE_NOTE',
  noteId,
});
