import { all, put, takeLatest, apply, call, select } from 'redux-saga/effects';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import * as api from '../api/notifications';
import * as notificationsActions from '../actions/notifications';
import * as arrayHelper from '../utils/array';

/**
 * Fetch notifications from the backend.
 */
function* fetchNotifications() {
  try {
    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to update comment.
    const notifications = yield call(
      api.fetchNotifications,
      request,
      false,
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
 * Fetch notifications from the backend.
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
    console.error('Could not update list of notifications.', error);
  }
}

/**
 * Main entry point for all notification sagas.
 */
export default function* notificationsSagas() {
  yield all([
    yield takeLatest('NOTIFICATIONS_REQUESTED', fetchNotifications),
    yield takeLatest('NOTIFICATIONS_MARK_AS_READ', markAsRead),
    yield takeLatest('NOTIFICATIONS_MARK_ALL_AS_READ', fetchNotifications),
  ]);
}
