const initialState = {
  notifications: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LESSON_NOTIFICATIONS_RECEIVED':
      return {
        ...state,
        notifications: action.notifications,
      };

    default:
      return state;
  }
};