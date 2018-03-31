import { all, takeEvery, select } from 'redux-saga/effects';

/**
 * Main entry point for all notebook sagas.
 */
export default function* lessonNotebookSagas() {
  yield all([
    takeEvery('LESSON_NOTEBOOK_OPEN', lockMobileScroll), // eslint-disable-line no-use-before-define
    takeEvery('LESSON_NOTEBOOK_CLOSE', unlockMobileScroll), // eslint-disable-line no-use-before-define
    takeEvery('persist/REHYDRATE', lockOrUnlockMobileScroll), // eslint-disable-line no-use-before-define
  ]);
}

/**
 * Adds a class to the body to freeze body's scroll bar.
 */
function* lockMobileScroll() { // eslint-disable-line require-yield
  document.body.classList.add('no-scroll-mobile');
}

/**
 * Removes a class from the body which freezes body's scroll bar.
 */
function* unlockMobileScroll() { // eslint-disable-line require-yield
  document.body.classList.remove('no-scroll-mobile');
}

/**
 * Figure out if the body's scroll bar has to be locked or unlocked,
 * depending on the current notebook pane state.
 */
function* lockOrUnlockMobileScroll() {
  const isNotebookCollapsed = yield select(store => store.lessonNotebook.isCollapsed);
  // eslint-disable-next-line no-unused-expressions
  isNotebookCollapsed ? yield unlockMobileScroll() : yield lockMobileScroll();
}
