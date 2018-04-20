export default (state = {
  isCollapsed: true,
}, action) => {
  switch (action.type) {
    case 'LESSON_SIDEBAR_OPEN':
      return {
        ...state,
        isCollapsed: false,
      };

    case 'LESSON_SIDEBAR_CLOSE':
      return {
        ...state,
        isCollapsed: true,
      };
    default:
      return state;
  }
};
