/**
 * Make request to the backend to get Notifications.
 */
export const syncNotifications = () => ({
  type: 'LESSON_NOTIFICATIONS_REQUESTED',
});

/**
 * Request to the backend to get Notifications failed.
 */
export const syncNotificationsFailed = error => ({
  type: 'LESSON_NOTIFICATIONS_REQUEST_FAILED',
  error,
});

/**
 * Save received from backend Notifications to the application store.
 */
export const receiveNotifications = notifications => ({
  type: 'LESSON_NOTIFICATIONS_RECEIVED',
  notifications,
});

/**
 *
 */
export const togglePopup = () => ({
  type: 'LESSON_NOTIFICATIONS_POPUP_TOGGLE',
});

/**
 *
 */
export const closePopup = () => ({
  type: 'LESSON_NOTIFICATIONS_POPUP_CLOSE',
});
