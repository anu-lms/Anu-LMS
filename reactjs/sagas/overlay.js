import { all, takeEvery } from 'redux-saga/effects';

/**
 * React on overlay being opened.
 */
function* overlayOpened() {
  // When overlay is opened, the body content should become not
  // scrollable.
  yield document.body.classList.add('no-scroll');
}

/**
 * React on overlay being closed.
 */
function* overlayClosed() {
  // When overlay is closed, the body content should become scrollable
  // again.
  yield document.body.classList.remove('no-scroll');
}

/**
 * Main entry point for all search sagas.
 */
export default function* overlaySagas() {
  yield all([
    yield takeEvery('OVERLAY_OPEN', overlayOpened),
    yield takeEvery('OVERLAY_CLOSE', overlayClosed),
  ]);
}
