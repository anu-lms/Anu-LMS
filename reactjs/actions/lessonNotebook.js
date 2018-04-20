export const setActiveNote = noteId => ({
  type: 'LESSON_NOTEBOOK_SET_ACTIVE_NOTE',
  noteId,
});

export const showNotes = () => ({
  type: 'LESSON_NOTEBOOK_SHOW_NOTES',
});
