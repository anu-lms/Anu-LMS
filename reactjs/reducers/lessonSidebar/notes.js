export default (state = {
  isNoteListVisible: false,
  noteId: 0, // @todo: consider to use active note id from notebook storage instead?
}, action) => {
  switch (action.type) {
    case 'LESSON_SIDEBAR_OPEN': {
      if (action.activeTab === 'notes' && !action.context) {
        return {
          ...state,
          isNoteListVisible: true,
        };
      }
      return state;
    }

    case 'LESSON_NOTEBOOK_SET_ACTIVE_NOTE':
      return {
        ...state,
        noteId: action.noteId,
        isNoteListVisible: false,
      };

    case 'NOTE_DELETE': {
      // If the deleted note is not the currently viewed - ignore.
      if (state.noteId !== action.id) {
        return state;
      }

      // If deleted currently viewing note, then show the notes list.
      return {
        ...state,
        noteId: 0,
        isNoteListVisible: true,
      };
    }

    case 'LESSON_NOTEBOOK_SHOW_NOTES':

      // Show list of notebook notes instead of note edit.
      return {
        ...state,
        isNoteListVisible: true,
      };

    default:
      return state;
  }
};
