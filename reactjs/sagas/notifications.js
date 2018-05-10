import { all, put, takeLatest, apply, call } from 'redux-saga/effects';
import Alert from 'react-s-alert';
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
    );

    // Let store know that notifications were received.
    yield put(notificationsActions.receiveNotifications(notifications));
  }
  catch (error) {
    yield put(notificationsActions.syncNotificationsFailed(error));
    console.error('Could not update list of notifications.', error);
    Alert.error('Could not update list of notifications. Please, contact site administrator.');
  }
}

/**
 * Adds or removes `no-scroll` class to the body when notifications popup opened or closed.
 */
function* toggleBodyScroll({ type }) {
  // Remove no-scroll body class when popup closed.
  if (type === 'NOTIFICATIONS_POPUP_CLOSE') {
    document.body.classList.remove('no-scroll');
  }
  else if (type === 'NOTIFICATIONS_POPUP_TOGGLE') {
    // Add no-scroll body class when popup opened and remove this class otherwise.
    if (document.body.classList.contains('no-scroll')) {
      document.body.classList.remove('no-scroll');
    }
    else {
      document.body.classList.add('no-scroll');
    }
  }
}

/**
 * Main entry point for all notification sagas.
 */
export default function* notificationsSagas() {
  yield all([
    yield takeLatest('NOTIFICATIONS_REQUESTED', fetchNotifications),
    yield takeLatest('NOTIFICATIONS_POPUP_TOGGLE', toggleBodyScroll),
    yield takeLatest('NOTIFICATIONS_POPUP_CLOSE', toggleBodyScroll),
  ]);
}
