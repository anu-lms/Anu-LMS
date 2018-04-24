export default (state = {
  isCollapsed: true,
  activeTab: 'notes', // Allowed values: `notes`, `comments`.
  isLoading: false,
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
        isLoading: false,
      };

    case 'LESSON_OPENED':
      return {
        ...state,
        activeTab: 'notes',
      };

    case 'LESSON_SIDEBAR_SET_LOADING_STATE':
      return {
        ...state,
        isLoading: true,
      };

    case 'LESSON_SIDEBAR_REMOVE_LOADING_STATE':
      return {
        ...state,
        isLoading: false,
      };

    case 'LESSON_COMMENTS_REQUESTED':
      return {
        ...state,
        isLoading: true,
      };

    case 'LESSON_COMMENTS_RECEIVED':
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};
