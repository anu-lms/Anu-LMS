import { all, put, takeLatest, select, apply, call } from 'redux-saga/effects';
import Alert from 'react-s-alert';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import * as commentsApi from '../api/comments';
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

    // Get active organization of current user.
    const activeOrganization = yield select(store => store.user.activeOrganization);

    // Make a request to get list of comments.
    const comments = yield call(
      commentsApi.fetchComments,
      request, paragraphId, activeOrganization,
    );

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

    // Get current user data to filter by user's organization.
    const currentUser = yield select(store => store.user.data);

    // Get active organization of current user.
    const activeOrganization = yield select(store => store.user.activeOrganization);

    // Makes request to the backend to add a new comment.
    const comment = yield call(
      commentsApi.insertComment,
      request, currentUser.uid, paragraphId, activeOrganization, text, parentId,
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

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to update comment.
    const responseComment = yield call(
      commentsApi.updateComment,
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

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to update comment.
    const responseComment = yield call(
      commentsApi.updateComment,
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

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to update comment.
    yield call(
      commentsApi.deleteComment,
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
