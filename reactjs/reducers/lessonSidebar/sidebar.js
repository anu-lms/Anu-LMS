export default (state = {
  isCollapsed: true,
  activeTab: 'notes',
}, action) => {
  switch (action.type) {
    case 'LESSON_SIDEBAR_OPEN':
      return {
        ...state,
        activeTab: action.activeTab,
        isCollapsed: false,
      };

    case 'LESSON_SIDEBAR_CLOSE':
      return {
        ...state,
        isCollapsed: true,
      };

    case 'LESSON_OPENED':
      return {
        ...state,
        activeTab: 'notes',
      };

    default:
      return state;
  }
};
