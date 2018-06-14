import { all, put, call, takeEvery, select, apply } from 'redux-saga/effects';
import * as notebookHelpers from '../helpers/notebook';
import ClientAuth from '../auth/clientAuth';
import request from '../utils/request';
import * as lock from '../utils/lock';
import * as notebookApi from '../api/notebook';
import * as notebookActions from '../actions/notebook';
import * as lessonSidebarActions from '../actions/lessonSidebar';
import * as lessonNotebookActions from '../actions/lessonNotebook';

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
      // request.set('X-CSRF-Token', sessionToken);

      // Making sure the request object includes the valid access token.
      const auth = new ClientAuth();
      const accessToken = yield apply(auth, auth.getAccessToken);
      request.set('Authorization', `Bearer ${accessToken}`);

      // Sending backend request to remove the note.
      yield notebookApi.deleteNote(request, note.uuid);
    }
    catch (error) {
      console.log('Could not delete the note.', error);
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
  const isNotebookCollapsed = yield select(store => store.lessonSidebar.sidebar.isCollapsed);
  // eslint-disable-next-line no-unused-expressions
  isNotebookCollapsed ? yield unlockMobileScroll() : yield lockMobileScroll();
}

/**
 * Sidebar is opened event happend.
 */
function* sidebarIsOpened({ activeTab, context }) {
  // Adds a class to the body to freeze body's scroll bar.
  yield lockMobileScroll();

  if (activeTab === 'notes') {
    // Creates a new note and set it active.
    if (context === 'add_new_note') {
      // Set loading state.
      yield put(lessonSidebarActions.setLoadingState());

      // Lock logout until note add operation is safely completed.
      const lockId = lock.add('notebook-add-note');

      // Attaches session token to the request.
      const sessionToken = yield select(reduxStore => reduxStore.user.sessionToken);
      // request.set('X-CSRF-Token', sessionToken);

      // Making sure the request object includes the valid access token.
      const auth = new ClientAuth();
      const accessToken = yield apply(auth, auth.getAccessToken);
      request.set('Authorization', `Bearer ${accessToken}`);

      // Make a request to the backend to create a new note.
      const note = yield call(
        notebookApi.createNote,
        request,
      );

      // Add recently created note to the application store.
      yield put(notebookActions.addNoteToStore(note));

      // Set the active note id for the lesson.
      yield put(lessonNotebookActions.setActiveNote(note.id));

      lock.release(lockId);

      // Removing loading state.
      yield put(lessonSidebarActions.removeLoadingState());
    }
    else {
      // Sync notes in app store when user open sidebar.
      yield put(notebookActions.syncNotes());
    }
  }
}

/**
 * Main entry point for all notebook sagas.
 */
export default function* lessonNotebookSagas() {
  yield all([
    takeEvery('LESSON_SIDEBAR_OPEN', sidebarIsOpened),
    takeEvery('LESSON_SIDEBAR_CLOSE', unlockMobileScroll),
    takeEvery('persist/REHYDRATE', lockOrUnlockMobileScroll),
    takeEvery('LESSON_NOTEBOOK_SHOW_NOTES', removeEmptyNote),
    takeEvery('LESSON_SIDEBAR_CLOSE', removeEmptyNote),
  ]);
}
