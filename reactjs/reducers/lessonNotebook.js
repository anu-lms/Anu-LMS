export default (state = { isCollapsed: true, noteId: 0 }, action) => {
  console.log(action);

  switch (action.type) {

    case 'NAVIGATION_TOGGLE':
      return {
        ...state,
        isCollapsed: true,
      };

    case 'LESSON_NOTEBOOK_OPENED':
      return {
        ...state,
        isCollapsed: false,
      };

    case 'LESSON_NOTEBOOK_CLOSED':
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
