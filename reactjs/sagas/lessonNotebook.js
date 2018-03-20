import { all, put, take, takeEvery, select, apply } from 'redux-saga/effects';

/**
 * Main entry point for all notebook sagas.
 */
export default function* lessonNotebookSagas() {
  yield all([
    takeEvery('LESSON_NOTEBOOK_OPEN', lockMobileScroll),
    takeEvery('LESSON_NOTEBOOK_CLOSE', unlockMobileScroll),
    takeEvery('persist/REHYDRATE', lockOrUnlockMobileScroll),
  ]);
};

/**
 * Adds a class to the body to freeze body's scroll bar.
 */
function* lockMobileScroll() {
  document.body.classList.add('no-scroll-mobile');
}

/**
 * Removes a class from the body which freezes body's scroll bar.
 */
function* unlockMobileScroll() {
  document.body.classList.remove('no-scroll-mobile');
}

/**
 * Figure out if the body's scroll bar has to be locked or unlocked,
 * depending on the current notebook pane state.
 */
function* lockOrUnlockMobileScroll() {
  let isNotebookCollapsed = yield select(store => store.lessonNotebook.isCollapsed);
  isNotebookCollapsed ? yield unlockMobileScroll() : yield lockMobileScroll();
}
