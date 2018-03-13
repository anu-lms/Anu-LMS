import { all, fork, take, takeEvery, select, call, cancel, apply } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { getProgress } from '../helpers/lesson';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';

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
    takeEvery('LESSON_OPENED', lessonProgressSyncWatcher)
  ]);
};

/**
 * Saga watcher for lesson to open.
 * As soon as lesson is opened - the saga will start observing
 * the lesson progress to send it to the backend if the progress
 * is made.
 */
function* lessonProgressSyncWatcher(action) {
  const { lesson } = action;

  // TODO: Figure out if session token can be requested just once on login.
  // TODO: Figure out if we can ignore session cookie in requests.
  // Get session token which is necessary for all post requests.
  const token = yield request
    .get('/session/token');

  // As soon as lesson is opened, we send request to the backend to log
  // a page hit.
  yield fork(sendLessonProgress, lesson, 0, token.text);

  // Run sync operation in the background. This operation will send lesson
  // progress to the backend every ${backendSyncDelay} milliseconds.
  const task = yield fork(syncLessonProgressInBackground, lesson, token.text);

  // As soon as lesson is opened, the saga is already awaiting for the dispatch
  // action which closes the lesson.
  yield take('LESSON_CLOSED');

  // Cancel progress sync operation. Take a look at "final" section in
  // syncLessonProgressInBackground() - it is called when this task is
  // getting cancelled.
  yield cancel(task);
}

/**
 * Saga action to send lesson progress to the backend.
 */
function* syncLessonProgressInBackground(lesson, token) {

  // The delay before we start sync process with the backend.
  yield delay(backendSyncDelay);

  // Initial progress equals lesson progress from the backend.
  let progress = lesson.progress;

  let latestProgress;
  let lessons;

  try {
    // Keep tracking progress updates until the task is cancelled.
    // "finally" section in try / catch handles cancellation of this task.
    while (true) {

      // Get the lastest progress of lesson from the redux store.
      lessons = yield select(state => state.lesson);
      latestProgress = getProgress(lessons, lesson);

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
  catch(e) {
    console.log('Error during sync of lesson progress:');
    console.log(e);
  }
  // Executes on task cancellation.
  finally {

    // Check the latest lesson's progress the last time.
    lessons = yield select(state => state.lesson);
    latestProgress = getProgress(lessons, lesson);

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

  } catch(e) {
    console.log('Could not send lesson\'s progress to the backend. Error:');
    console.log(e);
  }
}
