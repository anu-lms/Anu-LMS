export default (state = { isCollapsed: false }, action) => {

  switch (action.type) {
    case 'NAVIGATION_TOGGLE':
      return {
        isCollapsed: !state.isCollapsed,
      };

    default:
      return state;
  }
};
