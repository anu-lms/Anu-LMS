import { all, put, takeEvery, select, apply } from 'redux-saga/effects';
import * as notebookHelpers from '../helpers/notebook';
import ClientAuth from '../auth/clientAuth';
import request from '../utils/request';
import * as lock from '../utils/lock';
import * as notebookActions from '../actions/notebook';
import * as notebookApi from '../api/notebook';
/* eslint-disable no-use-before-define */

/**
 * Main entry point for all notebook sagas.
 */
export default function* lessonNotebookSagas() {
  yield all([
    takeEvery('LESSON_SIDEBAR_OPEN', lockMobileScroll),
    takeEvery('LESSON_SIDEBAR_CLOSE', unlockMobileScroll),
    takeEvery('persist/REHYDRATE', lockOrUnlockMobileScroll),
    takeEvery('LESSON_NOTEBOOK_SHOW_NOTES', removeEmptyNote),
    takeEvery('LESSON_SIDEBAR_CLOSE', removeEmptyNote),
  ]);
}

/**
 * Removes empty note from the backend in case if the note was closed
 * as empty.
 */
function* removeEmptyNote() {
  const activeNoteId = yield select(store => store.lessonSidebar.notes.noteId);
  // eslint-disable-next-line max-len
  const note = yield select(store => notebookHelpers.getNoteById(store.notebook.notes, activeNoteId));

  // If the recently viewed note is empty - remove it from the backend.
  if (note && notebookHelpers.isEmptyNote(note)) {
    // Lock logout until delete operation is safely completed.
    const lockId = lock.add('notebook-delete-note');

    // Immediately remove note from the notebook.
    yield put(notebookActions.deleteNote(activeNoteId));

    // Make DELETE request.
    try {
      // Attaches session token to the request.
      const sessionToken = yield select(reduxStore => reduxStore.user.sessionToken);
      request.set('X-CSRF-Token', sessionToken);

      // Making sure the request object includes the valid access token.
      const auth = new ClientAuth();
      const accessToken = yield apply(auth, auth.getAccessToken);
      request.set('Authorization', `Bearer ${accessToken}`);

      // Sending backend request to remove the note.
      yield notebookApi.deleteNote(request, note.uuid);
    }
    catch (error) {
      console.log('Could not delete the note. Error: ');
      console.log(error);
    }

    lock.release(lockId);
  }
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
  const isNotebookCollapsed = yield select(store => store.lessonSidebar.notes.isCollapsed);
  // eslint-disable-next-line no-unused-expressions
  isNotebookCollapsed ? yield unlockMobileScroll() : yield lockMobileScroll();
}
