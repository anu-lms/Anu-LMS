export const open = () => ({
  type: 'LESSON_NOTEBOOK_OPEN'
});

export const close = () => ({
  type: 'LESSON_NOTEBOOK_CLOSE'
});

export const setActiveNote = note => ({
  type: 'LESSON_NOTEBOOK_SET_NOTE',
  note,
});
