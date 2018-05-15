/**
 * Make request to the backend to get read Notifications.
 */
export const fetchRead = () => ({
  type: 'NOTIFICATIONS_REQUESTED',
  isRead: true,
});

/**
 * Make request to the backend to get unread Notifications.
 */
export const fetchUnread = () => ({
  type: 'NOTIFICATIONS_REQUESTED',
  isRead: false,
});

/**
 * Request to the backend to get Notifications failed.
 */
export const syncNotificationsFailed = error => ({
  type: 'NOTIFICATIONS_REQUEST_FAILED',
  error,
});

/**
 * Save received from backend Notifications to the application store.
 */
export const receiveNotifications = notifications => ({
  type: 'NOTIFICATIONS_RECEIVED',
  notifications,
});

/**
 * Mark notification item as read.
 */
export const markAsRead = notificationId => ({
  type: 'NOTIFICATIONS_MARK_AS_READ',
  notificationId,
});

/**
 * Mark notification item as read in applications store.
 */
export const markAsReadInStore = notificationId => ({
  type: 'NOTIFICATIONS_MARK_AS_READ_IN_STORE',
  notificationId,
});

/**
 * Mark all notification items as read.
 */
export const markAllAsRead = () => ({
  type: 'NOTIFICATIONS_MARK_ALL_AS_READ',
});

/**
 * Mark all notification items as read in applications store.
 */
export const markAllAsReadInStore = () => ({
  type: 'NOTIFICATIONS_MARK_ALL_AS_READ_IN_STORE',
});

/**
 * TODO: Comment.
 */
export const liveNotificationAdd = notification => ({
  type: 'NOTIFICATIONS_LIVE_NOTIFICATION_ADD',
  notification
});
