import { all, put, takeEvery, takeLatest, select, apply } from 'redux-saga/effects';
import request from '../utils/request';
import * as dataProcessors from '../utils/dataProcessors';
import * as lessonCommentsActions from '../actions/lessonComments';
import ClientAuth from '../auth/clientAuth';
/* eslint-disable no-use-before-define */

function* fetchComments() {
  const paragraphId = yield select(store => store.lessonSidebar.comments.paragraphId);

  // Making sure the request object includes the valid access token.
  const auth = new ClientAuth();
  const accessToken = yield apply(auth, auth.getAccessToken);
  request.set('Authorization', `Bearer ${accessToken}`);

  const userResponse = yield request.get('/user/me?_format=json');
  const currentUser = dataProcessors.userData(userResponse.body);

  const commentsQuery = {
    'include': 'uid, field_comment_parent',

    // Filter by paragraph id.
    'filter[field_comment_paragraph][value]': paragraphId,

    // Filter notes by current organization.
    'filter[field_comment_organization][condition][path]': 'field_comment_organization',
  };

  if (currentUser.organization) {
    commentsQuery['filter[field_comment_organization][condition][value]'] = currentUser.organization;
  }
  else {
    commentsQuery['filter[field_comment_organization][condition][operator]'] = 'IS NULL';
  }

  const responseComments = yield request
    .get('/jsonapi/anu_comment/anu_comment')
    .query(commentsQuery);

  const comments = dataProcessors.processCommentsList(responseComments.body.data);

  yield put(lessonCommentsActions.receiveComments(comments));
}

function* syncComments() {
  yield put(lessonCommentsActions.syncComments());
}

/**
 * Main entry point for all comments sagas.
 */
export default function* lessonCommentsSagas() {
  yield all([
    yield takeLatest('LESSON_COMMENTS_REQUESTED', fetchComments),
    yield takeLatest('LESSON_COMMENTS_SET_ACTIVE_PARAGRAPH', syncComments),
  ]);
}
