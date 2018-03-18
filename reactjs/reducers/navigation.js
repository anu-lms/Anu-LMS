export default (state = { isCollapsed: false }, action) => {

  switch (action.type) {
    case 'NAVIGATION_TOGGLE':
      return {
        isCollapsed: !state.isCollapsed,
      };

    case 'LESSON_NOTEBOOK_OPENED':
      return {
        isCollapsed: true,
      };

    // case 'LESSON_NOTEBOOK_CLOSED':
    //   return {
    //     isCollapsed: false,
    //   };

    default:
      return state;
  }
};
