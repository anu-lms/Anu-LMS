export default (state = { isCollapsed: true }, action) => {
  console.log(action);
  switch (action.type) {
    case 'NAVIGATION_TOGGLE':
      return {
        isCollapsed: true,
      };

    case 'LESSON_NOTEBOOK_OPENED':
      return {
        isCollapsed: false,
      };

    case 'LESSON_NOTEBOOK_CLOSED':
      return {
        isCollapsed: true,
      };

    default:
      return state;
  }
};