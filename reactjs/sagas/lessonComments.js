import { all, put, takeLatest, select, apply, call } from 'redux-saga/effects';
import Alert from 'react-s-alert';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import * as api from '../api/comments';
import * as dataProcessors from '../utils/dataProcessors';
import * as lessonCommentsActions from '../actions/lessonComments';

/**
 * Fetch comments from the backend.
 */
function* fetchComments() {
  const paragraphId = yield select(store => store.lessonSidebar.comments.paragraphId);
  try {
    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Get user data to filter by user's organization.
    const userResponse = yield request.get('/user/me?_format=json');
    const currentUser = dataProcessors.userData(userResponse.body);

    const commentsQuery = {
      'include': 'uid, field_comment_parent',
      // Filter by paragraph id.
      'filter[field_comment_paragraph][value]': paragraphId,
      // Filter comments by organization.
      'filter[field_comment_organization][condition][path]': 'field_comment_organization',
    };

    if (currentUser.organization) {
      // User should see comments only from users within same organization.
      commentsQuery['filter[field_comment_organization][condition][value]'] = currentUser.organization;
    }
    else {
      // If user isn't assigned to any organization,
      // he should see comments from users without organization as well.
      commentsQuery['filter[field_comment_organization][condition][operator]'] = 'IS NULL';
    }

    // Make a request to get list of comments.
    const responseComments = yield request
      .get('/jsonapi/paragraph_comment/paragraph_comment')
      .query(commentsQuery);

    // Normalize Comments.
    const comments = dataProcessors.processCommentsList(responseComments.body.data);

    // Let store know that comments were received.
    yield put(lessonCommentsActions.receiveComments(comments));
  }
  catch (error) {
    yield put(lessonCommentsActions.syncCommentsFailed(error));
    console.error('Could not update list of comments.', error);
    Alert.error('Could not update list of comments. Please, contact site administrator.');
  }
}

/**
 * Update comments in store when comments sidebar is opened.
 */
function* sidebarIsOpened() {
  const activeTab = yield select(store => store.lessonSidebar.sidebar.activeTab);

  if (activeTab === 'comments') {
    yield put(lessonCommentsActions.syncComments());
  }
}

function* addComment({ text, parentId }) {
  const paragraphId = yield select(store => store.lessonSidebar.comments.paragraphId);
  try {
    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Get user data to filter by user's organization.
    const userResponse = yield request.get('/user/me?_format=json');
    const currentUser = dataProcessors.userData(userResponse.body);

    const comment = yield call(
      api.insertComment,
      request, currentUser.uid, paragraphId, currentUser.organization, text, parentId,
    );

    yield put(lessonCommentsActions.addCommentToStore(comment));
  }
  catch (error) {
    yield put(lessonCommentsActions.addCommentError(error));
    console.error('Could not add a comment.', error);
    Alert.error('Could not add a comment. Please, contact site administrator.');
  }
}

/**
 * Main entry point for all comments sagas.
 */
export default function* lessonCommentsSagas() {
  yield all([
    yield takeLatest('LESSON_COMMENTS_INSERT_COMMENT', addComment),
    yield takeLatest('LESSON_COMMENTS_REQUESTED', fetchComments),
    yield takeLatest('LESSON_SIDEBAR_OPEN', sidebarIsOpened),
  ]);
}
