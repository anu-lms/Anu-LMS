// Because we need to hide navigation by default on mobile, but show by default on Desktop,
// we use isCollapsedMobile property for mobile devices and isCollapsed for desktop.
export default (state = { isCollapsed: false, isCollapsedMobile: true }, action) => {

  switch (action.type) {
    case 'NAVIGATION_TOGGLE':
      return {
        isCollapsed: !state.isCollapsed,
        isCollapsedMobile: !state.isCollapsed,
      };

    case 'NAVIGATION_OPEN':
      return {
        isCollapsed: false,
        isCollapsedMobile: false,
      };

    case 'NAVIGATION_CLOSE':
      return {
        isCollapsed: true,
        isCollapsedMobile: true,
      };

    default:
      return state;
  }
};
