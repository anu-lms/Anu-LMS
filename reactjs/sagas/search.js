import { all, put, takeLatest, apply, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import * as api from '../api/search';
import * as searchActions from '../actions/search';

/**
 * Amount of milliseconds before frontend will attempt
 * to query search to the backend.
 */
const backendSearchDelay = 350;

/**
 * Fetch search results from the backend.
 */
function* fetchSearch({ text }) {
  try {

    // There's a small delay between a user finishing the typing and frontend
    // sending request to search. It is introduced in order to avoid flooding
    // the backend with tons of requests if a user types in fast. If a user
    // is typing fast, then saga will automatically cancel this function and
    // it will not get to the backend request. If a user is typing slowly,
    // then it is expected to refresh search results as he types.
    yield delay(backendSearchDelay);

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    let searchResults = [];
    if (text && text.length > 1) {
      // Makes request to the backend to fetch search results.
      searchResults = yield call(apii.fetch, request, text);
    }

    // Let store know that search results were received.
    yield put(searchActions.received(searchResults));
  }
  catch (error) {
    yield put(searchActions.fetchFailed(error));
    console.error('Could not update list of search results.', error);
  }
}

/**
 * Main entry point for all search sagas.
 */
export default function* searchSagas() {
  yield all([
    yield takeLatest('SEARCH_REQUESTED', fetchSearch),
  ]);
}
