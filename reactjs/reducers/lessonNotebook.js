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

    default:
      return state;
  }
};
