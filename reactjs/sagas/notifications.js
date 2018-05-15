import { all, put, select, takeEvery, takeLatest, apply, call } from 'redux-saga/effects';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import socketio from 'socket.io-client';
import * as api from '../api/notifications';
import * as notificationsActions from '../actions/notifications';
import * as dataProcessors from '../utils/dataProcessors';

import { store } from '../store/store';
const socket = socketio('http://app.docker.localhost:8000');

socket.on('notification', function(notification) {
  console.log('a new notification incoming...');
  store.dispatch(notificationsActions.liveNotificationAdd(notification));
});

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
    );

    // Let store know that notifications were received.
    yield put(notificationsActions.receiveNotifications(notifications));
  }
  catch (error) {
    yield put(notificationsActions.syncNotificationsFailed(error));
    console.error('Could not update list of notifications.', error);
  }
}

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
    yield takeEvery('NOTIFICATIONS_LIVE_NOTIFICATION_ADD', handleIncomingLiveNotification)
  ]);
}
