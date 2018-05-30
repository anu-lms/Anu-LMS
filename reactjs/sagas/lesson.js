import { all, fork, take, put, takeEvery, select, call, cancel, apply } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from '../utils/request';
import * as lessonActions from '../actions/lesson';
import * as lessonHelper from '../helpers/lesson';
import ClientAuth from '../auth/clientAuth';
/* eslint-disable no-use-before-define */

/**
 * Amount of milliseconds before frontend will attempt
 * to sync changed with backend (if there are some updates).
 */
const backendSyncDelay = 3500;

/**
 * Main entry point for all lesson sagas.
 */
export default function* lessonSagas() {
  yield all([
    takeEvery('LESSON_OPENED', lessonProgressSyncWatcher),
    takeEvery('LESSON_OPENED', lessonQuizzesDataFetcher),
  ]);
}

/**
 * Saga watcher for lesson to open.
 * As soon as lesson is opened - the saga will start observing
 * the lesson progress to send it to the backend if the progress
 * is made.
 */
function* lessonProgressSyncWatcher(action) {
  const { lesson } = action;

  // Get session token which is necessary for all post requests.
  let sessionToken = yield select(reduxStore => reduxStore.user.sessionToken);

  if (!sessionToken) {
    // Store is empty yet when function executes first time (after page reload).
    const sessionResponse = yield request.get('/session/token');
    sessionToken = sessionResponse.text;
  }

  // As soon as lesson is opened, we send request to the backend to log
  // a page hit.
  yield fork(sendLessonProgress, lesson, 0, sessionToken);

  // Run sync operation in the background. This operation will send lesson
  // progress to the backend every ${backendSyncDelay} milliseconds.
  const task = yield fork(syncLessonProgressInBackground, lesson, sessionToken);

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
        .get(`/quizzes/results/${quizIds.join(',')}?_format=json`);

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
    } catch (e) {
      console.log('Could not load quiz results from the backend. Error:');
      console.log(e);
    }
  }
}

/**
 * Saga action to send lesson progress to the backend.
 */
function* syncLessonProgressInBackground(lesson, token) {
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
      lessons = yield select(state => state.lesson);
      latestProgress = lessonHelper.getProgress(lessons, lesson);

      // If latest progress is bigger than the previous value (no matter
      // if this value is from backend or from redux store) - we send the
      // updated progress to the backend.
      if (latestProgress > progress) {
        progress = latestProgress;
        yield call(sendLessonProgress, lesson, latestProgress, token);
      }

      // Wait before checking the lesson's progress again.
      yield delay(backendSyncDelay);
    }
  }
  catch (e) {
    console.log('Error during sync of lesson progress:');
    console.log(e);
  }
  // Executes on task cancellation.
  finally {
    // Check the latest lesson's progress the last time.
    lessons = yield select(state => state.lesson);
    latestProgress = lessonHelper.getProgress(lessons, lesson);

    // If there is some progress, send it to the backend before the background
    // sync task is cancelled for this lesson.
    if (latestProgress > progress) {
      yield call(sendLessonProgress, lesson, latestProgress, token);
    }
  }
}

/**
 * Helper function which sends lesson's progress to the backend.
 */
function* sendLessonProgress(lesson, progress, token) {
  try {
    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Sending request to the custom REST endpoint.
    yield request
      .post(`/learner/progress/${lesson.id}/${progress}?_format=json`)
      .set('Content-Type', 'application/json')
      .set('X-CSRF-Token', token);
  } catch (e) {
    console.log('Could not send lesson\'s progress to the backend. Error:');
    console.log(e);
  }
}
