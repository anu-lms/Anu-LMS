import { all, put, select, takeEvery, takeLatest, apply, call } from 'redux-saga/effects';
import { store } from '../store/store';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import socketio from 'socket.io-client';
import * as api from '../api/notifications';
import * as notificationsActions from '../actions/notifications';
import * as arrayHelper from '../utils/array';
import * as dataProcessors from '../utils/dataProcessors';

// TODO: Move to clientside only.
if (typeof window !== 'undefined') {
  const socket = socketio(window.location.protocol + '//' + window.location.hostname + ':8000');

  socket.on('notification', function(notification) {
    store.dispatch(notificationsActions.liveNotificationAdd(notification));
  });
}

/**
 * Fetch notifications from the backend.
 */
function* fetchNotifications({ isRead }) {
  try {
    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to update comment.
    const notifications = yield call(
      api.fetchNotifications,
      request,
      isRead,
    );

    // Let store know that notifications were received.
    yield put(notificationsActions.receiveNotifications(notifications));
  }
  catch (error) {
    yield put(notificationsActions.syncNotificationsFailed(error));
    console.error('Could not update list of notifications.', error);
  }
}

/**
 * Send request to the backend to mark notification as read.
 */
function* markAsRead({ notificationId }) {
  try {
    const notifications = yield select(store => store.notifications.notifications);
    const notificationItem = arrayHelper.getObjectById(notifications, notificationId);

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to update comment.
    yield call(
      api.markAsRead,
      request,
      notificationItem.bundle,
      notificationItem.uuid,
    );
  }
  catch (error) {
    console.error('Could not mark notifications as read.', error);
  }
}

/**
 * Send request to the backend to mark all notifications as read.
 */
function* markAllAsRead() {
  try {
    const token = yield request.get('/session/token');
    request.set('X-CSRF-Token', token.text);

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to update comment.
    yield call(
      api.markAllAsRead,
      request,
    );
  }
  catch (error) {
    console.error('Could not mark all notifications as read.', error);
  }
}

/**
 * TODO: Comment.
 */
function* handleIncomingLiveNotification({ notification }) {

  const currentUserUid = yield select(store => store.user.uid);

  if (notification.recipient === currentUserUid) {
    const notifications = dataProcessors.processNotifications([notification]);

    // Let store know that notifications were received.
    yield put(notificationsActions.receiveNotifications(notifications));
  }
}

/**
 * Main entry point for all notification sagas.
 */
export default function* notificationsSagas() {
  yield all([
    yield takeLatest('NOTIFICATIONS_REQUESTED', fetchNotifications),
    yield takeLatest('NOTIFICATIONS_MARK_AS_READ', markAsRead),
    yield takeLatest('NOTIFICATIONS_MARK_ALL_AS_READ', markAllAsRead),
    yield takeEvery('NOTIFICATIONS_LIVE_NOTIFICATION_ADD', handleIncomingLiveNotification),
  ]);
}
