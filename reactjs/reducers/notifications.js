const initialState = {
  notifications: [],
  isOpened: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LESSON_NOTIFICATIONS_RECEIVED':
      return {
        ...state,
        notifications: action.notifications,
      };

    case 'LESSON_NOTIFICATIONS_POPUP_TOGGLE':
      return {
        ...state,
        isOpened: !state.isOpened,
      };

    case 'LESSON_NOTIFICATIONS_POPUP_CLOSE':
      return {
        ...state,
        isOpened: false,
      };

    default:
      return state;
  }
};
