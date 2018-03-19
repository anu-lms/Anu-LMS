export default (state = { isCollapsed: true, note: null }, action) => {

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

    case 'LESSON_NOTEBOOK_SET_NOTE':
      return {
        ...state,
        note: action.note,
      };

    default:
      return state;
  }
};
