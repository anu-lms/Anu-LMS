export default (state = { isCollapsed: true, noteId: 0 }, action) => {

  switch (action.type) {

    case 'LESSON_NOTEBOOK_OPEN':
      return {
        ...state,
        isCollapsed: false,
      };

    case 'LESSON_NOTEBOOK_CLOSE':
      return {
        ...state,
        isCollapsed: true,
      };


    case 'LESSON_NOTEBOOK_SET_ACTIVE_NOTE':
      return {
        ...state,
        noteId: action.noteId,
      };

    case 'NOTE_DELETE':

      // If the deleted note is not the currently viewed - ignore.
      if (state.noteId !== action.id) {
        return state;
      }

      // If deleted currently viewing note, then close the notebook pane
      // and reset the note ID.
      return {
        ...state,
        isCollapsed: true,
        noteId: 0,
      };

    default:
      return state;
  }
};
