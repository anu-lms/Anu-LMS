import { all, fork, take, put, takeEvery, select, call, cancel, apply } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import _includes from 'lodash/includes';
import request from '../utils/request';
import * as lessonActions from '../actions/lesson';
import * as lessonCommentsActions from '../actions/lessonComments';
import * as lessonHelper from '../helpers/lesson';
import * as arrayHelper from '../utils/array';
import ClientAuth from '../auth/clientAuth';
/* eslint-disable no-use-before-define */

/**
 * Amount of milliseconds before frontend will attempt
 * to sync changed with backend (if there are some updates).
 */
const backendSyncDelay = 3500;

/**
 * Saga watcher for lesson to open.
 * As soon as lesson is opened - the saga will start observing
 * the lesson progress to send it to the backend if the progress
 * is made.
 */
function* lessonProgressSyncWatcher(action) {
  const { lesson } = action;

  // As soon as lesson is opened, we send request to the backend to log
  // a page hit.
  yield fork(sendLessonProgress, lesson, 0);

  // Run sync operation in the background. This operation will send lesson
  // progress to the backend every ${backendSyncDelay} milliseconds.
  const task = yield fork(syncLessonProgressInBackground, lesson);

  // As soon as lesson is opened, the saga is already awaiting for the dispatch
  // action which closes the lesson.
  yield take('LESSON_CLOSED');

  // Cancel progress sync operation. Take a look at "final" section in
  // syncLessonProgressInBackground() - it is called when this task is
  // getting cancelled.
  yield cancel(task);
}

/**
 * Fetch previously submitted quizzes data from the backend
 * for the opened lesson.
 */
function* lessonQuizzesDataFetcher(action) {
  const { lesson } = action;

  if (lessonHelper.hasQuizzes(lesson)) {
    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Get list of quiz IDs from the lesson paragraphs.
    const quizIds = lessonHelper.getQuizzesIds(lesson);

    try {
      // Load previously submitted quizzes for the current user from the backend.
      const quizzesResonse = yield request
        .get(`/quizzes/results/${quizIds.join(',')}`)
        .query({ '_format': 'json' });

      const quizzesResults = quizzesResonse.body;

      // Set quiz data into the redux store one by one.
      for (const index in quizzesResults) { // eslint-disable-line no-restricted-syntax
        if (quizzesResults.hasOwnProperty(index)) { // eslint-disable-line no-prototype-builtins
          const quizResult = quizzesResults[index];
          yield put(lessonActions.setQuizResult(lesson.id, quizResult.id, quizResult.value));
        }
      }

      // If the current user has previous quiz results, then we mark data we
      // put into the redux store as synchronized with the backed.
      if (quizzesResults.length > 0) {
        yield put(lessonActions.setQuizzesSaved(lesson.id));
      }
    } catch (error) {
      console.log('Could not load quiz results from the backend.', error);
    }
  }
}

/**
 * Saga action to send lesson progress to the backend.
 */
function* syncLessonProgressInBackground(lesson) {
  // The delay before we start sync process with the backend.
  yield delay(backendSyncDelay);

  // Initial progress equals lesson progress from the backend.
  let { progress } = lesson;

  let latestProgress;
  let lessons;

  try {
    // Keep tracking progress updates until the task is cancelled.
    // "finally" section in try / catch handles cancellation of this task.
    while (true) {
      // Get the lastest progress of lesson from the redux store.
      lessons = yield select(state => state.lesson.lessons);
      latestProgress = lessonHelper.getProgress(lessons, lesson);

      // If latest progress is bigger than the previous value (no matter
      // if this value is from backend or from redux store) - we send the
      // updated progress to the backend.
      if (latestProgress > progress) {
        progress = latestProgress;
        yield call(sendLessonProgress, lesson, latestProgress);
      }

      // Wait before checking the lesson's progress again.
      yield delay(backendSyncDelay);
    }
  } catch (error) {
    console.log('Error during sync of lesson progress:', error);
  }
  // Executes on task cancellation.
  finally {
    // Check the latest lesson's progress the last time.
    lessons = yield select(state => state.lesson.lessons);
    latestProgress = lessonHelper.getProgress(lessons, lesson);

    // If there is some progress, send it to the backend before the background
    // sync task is cancelled for this lesson.
    if (latestProgress > progress) {
      yield call(sendLessonProgress, lesson, latestProgress);
    }
  }
}

/**
 * Helper function which sends lesson's progress to the backend.
 */
function* sendLessonProgress(lesson, progress) {
  try {
    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Sending request to the custom REST endpoint.
    yield request
      .post(`/learner/progress/${lesson.id}/${progress}`)
      .set('Content-Type', 'application/json')
      .query({ '_format': 'json' });
  } catch (error) {
    console.log('Could not send lesson\'s progress to the backend.', error);
  }
}

/**
 * Handles an event when comment update arrives from the websocket.
 */
function* handleIncomingLiveComment({ action, comment }) {
  const userId = yield select(reduxStore => reduxStore.user.data.uid);
  const userOrganizations = yield select(reduxStore => reduxStore.user.data.organization);
  const userOrganizationIds = userOrganizations.length > 0
    ? userOrganizations.map(organization => organization.id)
    : [0]; // Initialize organizations array with '0' (default id if no orgs) if user has no orgs.

  const activeParagraphId = yield select(reduxStore => reduxStore.lessonSidebar.comments.paragraphId); // eslint-disable-line max-len

  // Skip comments made by current user.
  if (comment.author.uid === userId) {
    return;
  }

  // Skip comments from not allowed organization.
  if (!_includes(userOrganizationIds, comment.organizationId)) {
    return;
  }
  // Add an aditional flag to let app know that comment updated was processed by live updates.
  comment.isProcessedByLive = true;

  switch (action) {
    case 'insert': {
      if (activeParagraphId > 0) {
        // Set isHighlighted flag by default for new live comments.
        comment.isHighlighted = true;
        yield put(lessonCommentsActions.addCommentToStore(comment));
      }
      yield put(lessonActions.commentsAmountIncrease(comment.paragraphId, comment.organizationId));
      break;
    }

    case 'update': {
      if (activeParagraphId > 0) {
        // isRead value in pushed comment calculated regarding user who pushed it.
        // We shouldn't override isRead flag and use value specific
        // to current user from comment in store.
        const comments = yield select(reduxStore => reduxStore.lessonSidebar.comments.comments);
        const commentInStore = arrayHelper.getObjectById(comments, comment.id);
        if (commentInStore) {
          comment.isRead = commentInStore.isRead;
        }

        yield put(lessonCommentsActions.updateCommentInStore(comment));
      }
      // Decrease an amount of comments if comment was marked as deleted.
      if (comment.deleted) {
        yield put(lessonActions.commentsAmountDecrease(comment.paragraphId, comment.organizationId)); // eslint-disable-line max-len
      }
      break;
    }

    case 'delete': {
      if (activeParagraphId > 0) {
        yield put(lessonCommentsActions.deleteCommentFromStore(comment.id));
      }
      // Decrease comments amount, except comments marked as deleted (they already processed).
      if (!comment.deleted) {
        yield put(lessonActions.commentsAmountDecrease(comment.paragraphId, comment.organizationId)); // eslint-disable-line max-len
      }
      break;
    }

    default:
      break;
  }
}

/**
 * Main entry point for all lesson sagas.
 */
export default function* lessonSagas() {
  yield all([
    takeEvery('LESSON_OPENED', lessonProgressSyncWatcher),
    takeEvery('LESSON_OPENED', lessonQuizzesDataFetcher),
    takeEvery('LESSON_COMMENTS_INCOMING_LIVE_PUSH', handleIncomingLiveComment),
  ]);
}
