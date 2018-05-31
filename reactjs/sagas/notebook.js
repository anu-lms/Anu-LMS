import { all, put, call, takeEvery, takeLatest, select, apply } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import Alert from 'react-s-alert';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import * as lock from '../utils/lock';
import * as notebookApi from '../api/notebook';
import * as notebookHelpers from '../helpers/notebook';
import * as notebookActions from '../actions/notebook';

/**
 * Amount of milliseconds before frontend will attempt
 * to sync changed with backend (if there are some updates).
 */
const backendSyncDelay = 4000;

/**
 * Saga watcher.
 * Takes care of data sync operation with the backend.
 */
function* notebookDataSyncWatcher() {
  // TODO: In general we could wait for title or body changes of notes
  // and start / stop saga depending on this, but it would be more complicated
  // and not needed at this stage.

  // Endless loop, because we don't know when to stop the monitoring of data
  // sync.
  while (true) { // eslint-disable-line no-constant-condition
    // Select list of available notes from the redux store.
    const notes = yield select(state => state.notebook.notes);

    // Filter by notes which are not yet saved.
    const unsavedNotes = notebookHelpers.getUnsavedNotes(notes);

    // Save each note to the backend.
    for (const index in unsavedNotes) { // eslint-disable-line no-restricted-syntax
      if (unsavedNotes.hasOwnProperty(index)) { // eslint-disable-line no-prototype-builtins
        const note = unsavedNotes[index];
        yield noteSave(note); // eslint-disable-line no-use-before-define
      }
    }

    // Wait for a certain interval before attempting to check the sync
    // status again.
    yield delay(backendSyncDelay);
  }
}

/**
 * Simple save of the note to the backend on demand.
 */
function* notebookNoteDataSave(action) {
  const { note } = action;
  yield noteSave(note); // eslint-disable-line no-use-before-define
}

/**
 * Helper function.
 * Performs note sync with the backend.
 *
 * @param note
 *   Note object.
 */
function* noteSave(note) {
  // Attaches session token to the request.
  const sessionToken = yield select(reduxStore => reduxStore.user.sessionToken);
  request.set('X-CSRF-Token', sessionToken);

  // Making sure the request object includes the valid access token.
  const auth = new ClientAuth();
  const accessToken = yield apply(auth, auth.getAccessToken);
  request.set('Authorization', `Bearer ${accessToken}`);

  // Lock logout until update operation for this note is safely completed.
  const lockId = lock.add('notebook-update-note');

  // Set the note's state to "Is saving".
  yield put(notebookActions.setNoteStateSaving(note.id));

  try {
    // Send backend request to update the note.
    yield notebookApi.updateNote(request, note.title, note.body, note.uuid);

    // TODO: DON'T SAVE IF CHANGES WERE MADE WHILE THE NOTE WAS SAVING.

    // Set the note's state to "Saved".
    yield put(notebookActions.setNoteStateSaved(note.id));
  }
  catch (error) {
    // Set the note's state to "Not Saved".
    yield put(notebookActions.setNoteStateNotSaved(note.id));
  }

  lock.release(lockId);
}

/**
 * Sync notes in app store when user open sidebar.
 */
function* sidebarIsOpened() {
  const activeTab = yield select(store => store.lessonSidebar.sidebar.activeTab);

  if (activeTab === 'notes') {
    yield put(notebookActions.syncNotes());
  }
}

/**
 * Fetch notes from the backend.
 */
function* fetchNotes() {
  const uid = yield select(reduxStore => reduxStore.user.uid);
  try {
    // Making sure the request object includes the valid access token.
    const auth = new ClientAuth();
    const accessToken = yield apply(auth, auth.getAccessToken);
    request.set('Authorization', `Bearer ${accessToken}`);

    // Makes request to the backend to fetch notes.
    const notes = yield call(
      notebookApi.fetch,
      request,
      uid,
    );

    // Let store know that notifications were received.
    yield put(notebookActions.receiveNotes(notes));
  }
  catch (error) {
    yield put(notebookActions.syncNotesFailed(error));
    console.error('Could not update list of notes.', error);
    Alert.error('Could not update list of notes. Please, contact site administrator.');
  }
}

/**
 * Main entry point for all notebook sagas.
 */
export default function* notebookSagas() {
  yield all([
    notebookDataSyncWatcher(),
    takeEvery('NOTE_SAVE', notebookNoteDataSave),
    takeLatest('NOTES_REQUESTED', fetchNotes),
    takeLatest('LESSON_SIDEBAR_OPEN', sidebarIsOpened),
  ]);
}
