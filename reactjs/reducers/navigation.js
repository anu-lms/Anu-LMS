export default (state = { isCollapsed: true }, action) => {

  switch (action.type) {
    case 'NAVIGATION_TOGGLE':
      return {
        isCollapsed: !state.isCollapsed,
      };

    case 'NAVIGATION_OPEN':
      return {
        isCollapsed: false,
      };

    case 'NAVIGATION_CLOSE':
      return {
        isCollapsed: true,
      };

    // case 'LESSON_NOTEBOOK_OPEN':
    //   return {
    //     isCollapsed: true,
    //   };

    // case 'LESSON_NOTEBOOK_CLOSE':
    //   return {
    //     isCollapsed: false,
    //   };

    default:
      return state;
  }
};
