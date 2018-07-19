import { all, put, takeLatest, select, apply, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import Alert from 'react-s-alert';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import * as commentsApi from '../api/comments';
import * as lessonActions from '../actions/lesson';
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
    yield put(lessonActions.commentsAmountSet(paragraphId, activeOrganization, commentsAmount));
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

    // Updates comments amount for paragraphs in store.
    yield put(lessonActions.commentsAmountIncrease(comment.paragraphId, comment.organizationId));
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

    // Updates comments amount for paragraphs in store.
    yield put(lessonActions.commentsAmountDecrease(comment.paragraphId, comment.organizationId));

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

    if (!comment.deleted) {
      // Updates comments amount for paragraphs in store.
      yield put(lessonActions.commentsAmountDecrease(comment.paragraphId, comment.organizationId));
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

function* markCommentsAsRead() {
  // Amount of milliseconds before frontend will attempt to make a query to the backend.
  const backendRequestDelay = 5000;

  // Set a delay to update comments in package, not one by one.
  yield delay(backendRequestDelay);

  try {
    const comments = yield select(store => store.lessonSidebar.comments.comments);

    // Get list of comments that should be marked as read on backend.
    const commentIds = comments
      .filter(comment => comment.isReadUpdating)
      .map(comment => comment.id);

    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    if (commentIds.length > 0) {
      // Makes request to the backend to mark list of comments as read.
      const responseCommentIds = yield call(
        commentsApi.markCommentsAsRead,
        request, commentIds,
      );

      // Updates comments in the application store.
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
