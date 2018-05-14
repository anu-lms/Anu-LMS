const initialState = {
  notifications: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'NOTIFICATIONS_RECEIVED':
      return {
        ...state,
        notifications: action.notifications,
      };

    case 'NOTIFICATIONS_MARK_AS_READ_IN_STORE': {
      // Search for the notification.
      const index = state.notifications.findIndex(element => element.id === action.notificationId);

      // If the notification was found, then we should update it.
      if (index !== -1) {
        return {
          ...state,
          notifications: [
            ...state.notifications.slice(0, index),
            {
              ...state.notifications[index],
              isRead: true,
            },
            ...state.notifications.slice(index + 1),
          ],
        };
      }

      // Otherwise return unchanged state.
      return state;
    }

    default:
      return state;
  }
};
