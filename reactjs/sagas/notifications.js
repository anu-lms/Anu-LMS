import { all, put, takeLatest, apply, call } from 'redux-saga/effects';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import * as api from '../api/notifications';
import * as notificationsActions from '../actions/notifications';

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
 * Main entry point for all notification sagas.
 */
export default function* notificationsSagas() {
  yield all([
    yield takeLatest('NOTIFICATIONS_REQUESTED', fetchNotifications),
  ]);
}
