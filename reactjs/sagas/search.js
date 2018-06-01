import { all, put, takeLatest, apply, call } from 'redux-saga/effects';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import * as api from '../api/search';
import * as searchActions from '../actions/search';

/**
 * Fetch search results from the backend.
 */
function* fetchSearch() {
  try {
    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to update comment.
    const searchResults = yield call(
      api.fetch,
      request,
    );

    console.log(searchResults);
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
