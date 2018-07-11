import { all, put, takeLatest, select, apply, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
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

    // Updates comments amount for active paragraph in store.
    const commentsAmount = comments.filter(comment => !comment.deleted).length;
    yield put(lessonCommentsActions.lessonCommentsAmountSet(paragraphId, activeOrganization, commentsAmount)); // eslint-disable-line max-len
  }
  catch (error) {
    yield put(lessonCommentsActions.syncCommentsFailed(error));
    console.error('Could not update list of comments.', error);
    Alert.error('Could not update list of comments. Please, contact site administrator.');
  }
}

/**
 * Update comments in store if comments sidebar is opened.
 */
function* syncCommentsIfTabActive() {
  // Don't execute the function if sidebar is collapsed.
  const isCollapsed = yield select(store => store.lessonSidebar.sidebar.isCollapsed);
  if (isCollapsed) {
    return;
  }

  // Get active lesson sidebar tab.
  const activeTab = yield select(store => store.lessonSidebar.sidebar.activeTab);

  if (activeTab === 'comments') {
    // Fetch comments from the backend and update in store.
    yield put(lessonCommentsActions.syncComments());
  }
}

function* addComment({ text, parentId }) {
  const paragraphId = yield select(store => store.lessonSidebar.comments.paragraphId);
  const comments = yield select(store => store.lessonSidebar.comments.comments);
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

    // Updates comments amount for active paragraph in store.
    const commentsAmount = comments.filter(item => !item.deleted).length + 1;
    yield put(lessonCommentsActions.lessonCommentsAmountSet(paragraphId, activeOrganization, commentsAmount)); // eslint-disable-line max-len
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

    // Get active organization of current user.
    const activeOrganization = yield select(store => store.user.activeOrganization);
    const paragraphId = yield select(store => store.lessonSidebar.comments.paragraphId);
    const commentsAmount = comments.filter(item => !item.deleted).length - 1;

    // Updates comments amount for active paragraph in store.
    yield put(lessonCommentsActions.lessonCommentsAmountSet(paragraphId, activeOrganization, commentsAmount)); // eslint-disable-line max-len

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

      if (parentComment.deleted && !lessonCommentsHelpers.hasChildrenComments(updatedComments, parentComment.id)) { // eslint-disable-line max-len
        yield call(deleteComment, { commentId: parentComment.id, showSuccessMessage: false });
      }
    }

    if (showSuccessMessage) {
      Alert.closeAll();
      Alert.success('Comment has been successfully deleted.');

      // Get active organization of current user.
      const activeOrganization = yield select(store => store.user.activeOrganization);
      const paragraphId = yield select(store => store.lessonSidebar.comments.paragraphId);
      const commentsAmount = comments.filter(item => !item.deleted).length - 1;

      // Updates comments amount for active paragraph in store.
      yield put(lessonCommentsActions.lessonCommentsAmountSet(paragraphId, activeOrganization, commentsAmount)); // eslint-disable-line max-len
    }
  }
  catch (error) {
    yield put(lessonCommentsActions.deleteCommentError(error));
    console.error('Could not delete a comment.', error);
    Alert.error('Could not delete a comment. Please, contact site administrator.');
  }
}

function* markCommentsAsRead() {
  /**
   * Amount of milliseconds before frontend will attempt
   * to query search to the backend.
   */
  const backendSearchDelay = 350;

  yield delay(backendSearchDelay);

  try {
    const comments = yield select(store => store.lessonSidebar.comments.comments);

    const commentIds = comments
      .filter(comment => comment.isReadUpdating)
      .map(comment => comment.id);

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    if (commentIds.length > 0) {
      // Makes request to the backend to update comment.
      const responseCommentIds = yield call(
        commentsApi.markCommentsAsRead,
        request, commentIds,
      );
      console.log(commentIds);

      // Updates comment in the application store.
      yield put(lessonCommentsActions.markCommentAsReadSuccessfull(responseCommentIds));
    }
  }
  catch (error) {
    console.error('Could not mark comments as read.', error);
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
    yield takeLatest('LESSON_COMMENTS_MARK_AS_READ', markCommentsAsRead),
    yield takeLatest('LESSON_COMMENTS_REQUESTED', fetchComments),
    yield takeLatest('LESSON_SIDEBAR_OPEN', syncCommentsIfTabActive),
    yield takeLatest('USER_SET_ORGANIZATION', syncCommentsIfTabActive),
  ]);
}
