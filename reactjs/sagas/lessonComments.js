import { all, put, takeLatest, select, apply, call } from 'redux-saga/effects';
import Alert from 'react-s-alert';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import * as api from '../api/comments';
import * as dataProcessors from '../utils/dataProcessors';
import * as lessonCommentsActions from '../actions/lessonComments';
import * as lessonCommentsHelpers from '../helpers/lessonComments';

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
    // @todo: replace with userApi.fetchCurrent().
    const userResponse = yield request.get('/user/me?_format=json');
    const currentUser = dataProcessors.userData(userResponse.body);

    // @todo: move to the api folder.
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
    const comments = responseComments.body.data
      .map(rawComment => dataProcessors.processComment(rawComment));

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
    const sessionToken = yield select(reduxStore => reduxStore.user.sessionToken);
    request.set('X-CSRF-Token', sessionToken);

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Get user data to filter by user's organization.
    // @todo: replace with userApi.fetchCurrent().
    const userResponse = yield request.get('/user/me?_format=json');
    const currentUser = dataProcessors.userData(userResponse.body);

    // Makes request to the backend to add a new comment.
    const comment = yield call(
      api.insertComment,
      request, currentUser.uid, paragraphId, currentUser.organization, text, parentId,
    );

    // Adds created comment to the application store.
    yield put(lessonCommentsActions.addCommentToStore(comment));
  }
  catch (error) {
    yield put(lessonCommentsActions.addCommentError(error));
    console.error('Could not add a comment.', error);
    Alert.error('Could not add a comment. Please, contact site administrator.');
  }
}

function* updateComment({ commentId, text }) {
  try {
    const comments = yield select(store => store.lessonSidebar.comments.comments);
    const comment = lessonCommentsHelpers.getCommentById(comments, commentId);

    const sessionToken = yield select(reduxStore => reduxStore.user.sessionToken);
    request.set('X-CSRF-Token', sessionToken);

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to update comment.
    const responseComment = yield call(
      api.updateComment,
      request, comment.uuid, { text },
    );

    // Updates comment in the application store.
    yield put(lessonCommentsActions.updateCommentInStore(responseComment));
  }
  catch (error) {
    yield put(lessonCommentsActions.updateCommentError(error));
    console.error('Could not update a comment.', error);
    Alert.error('Could not update a comment. Please, contact site administrator.');
  }
}

function* markCommentAsDeleted({ commentId }) {
  try {
    const comments = yield select(store => store.lessonSidebar.comments.comments);
    const comment = lessonCommentsHelpers.getCommentById(comments, commentId);

    // Attaches session token to the request.
    const sessionToken = yield select(reduxStore => reduxStore.user.sessionToken);
    request.set('X-CSRF-Token', sessionToken);

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to update comment.
    const responseComment = yield call(
      api.updateComment,
      request, comment.uuid, { deleted: true, text: '' },
    );

    // Updates comment in the application store.
    yield put(lessonCommentsActions.updateCommentInStore(responseComment));

    Alert.success('Comment has been successfully deleted.');
  }
  catch (error) {
    yield put(lessonCommentsActions.deleteCommentError(error));
    console.error('Could not delete a comment.', error);
    Alert.error('Could not delete a comment. Please, contact site administrator.');
  }
}

function* deleteComment({ commentId, showSuccessMessage = true }) {
  try {
    const comments = yield select(store => store.lessonSidebar.comments.comments);
    const comment = lessonCommentsHelpers.getCommentById(comments, commentId);

    // Attaches session token to the request.
    const sessionToken = yield select(reduxStore => reduxStore.user.sessionToken);
    request.set('X-CSRF-Token', sessionToken);

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to update comment.
    yield call(
      api.deleteComment,
      request, comment.uuid,
    );

    // Updates comment in the application store.
    yield put(lessonCommentsActions.deleteCommentFromStore(commentId));

    // Delete parent comment if it marked as deleted and has no children comments anymore.
    if (comment.parentId) {
      const updatedComments = yield select(store => store.lessonSidebar.comments.comments);
      const parentComment = lessonCommentsHelpers.getCommentById(updatedComments, comment.parentId);

      // eslint-disable-next-line max-len
      if (parentComment.deleted && !lessonCommentsHelpers.hasChildrenComments(updatedComments, parentComment.id)) {
        yield call(deleteComment, { commentId: parentComment.id, showSuccessMessage: false });
      }
    }

    if (showSuccessMessage) {
      Alert.closeAll();
      Alert.success('Comment has been successfully deleted.');
    }
  }
  catch (error) {
    yield put(lessonCommentsActions.deleteCommentError(error));
    console.error('Could not delete a comment.', error);
    Alert.error('Could not delete a comment. Please, contact site administrator.');
  }
}

/**
 * Main entry point for all comments sagas.
 */
export default function* lessonCommentsSagas() {
  yield all([
    yield takeLatest('LESSON_COMMENTS_INSERT_COMMENT', addComment),
    yield takeLatest('LESSON_COMMENTS_UPDATE_COMMENT', updateComment),
    yield takeLatest('LESSON_COMMENTS_DELETE_COMMENT', deleteComment),
    yield takeLatest('LESSON_COMMENTS_MARK_AS_DELETED', markCommentAsDeleted),
    yield takeLatest('LESSON_COMMENTS_REQUESTED', fetchComments),
    yield takeLatest('LESSON_SIDEBAR_OPEN', sidebarIsOpened),
  ]);
}
