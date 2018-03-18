export default (state = { isCollapsed: true, note: null }, action) => {

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

    case 'LESSON_NOTEBOOK_SET_NOTE':
      return {
        ...state,
        note: action.note,
      };

    default:
      return state;
  }
};
