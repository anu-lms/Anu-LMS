import { all, put, take, takeEvery, select, apply } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from '../utils/request';
import ClientAuth from '../auth/clientAuth';
import * as lock from '../utils/lock';
import * as notebookHelpers from '../helpers/notebook';
import * as notebookActions from '../actions/notebook';

/**
 * Amount of milliseconds before frontend will attempt
 * to sync changed with backend (if there are some updates).
 */
const backendSyncDelay = 4000;

/**
 * Main entry point for all notebook sagas.
 */
export default function* notebookSagas() {
  yield all([
    notebookDataSyncWatcher(),
    takeEvery('NOTE_SAVE', notebookNoteDataSave)
  ]);
};

/**
 * Saga watcher.
 * Takes care of data sync operation with the backend.
 */
function* notebookDataSyncWatcher() {

  // Trigger the sync watcher as soon as any note lands in the redux.
  // TODO: In general we could wait for title or body changes of notes
  // and start / stop saga depending on this, but it would be more complicated
  // and not needed at this stage.
  yield take('NOTE_ADD');

  // Endless loop, because we don't know when to stop the monitoring of data
  // sync.
  while(true) {

    // Select list of available notes from the redux store.
    const notes = yield select(state => state.notebook.notes);

    // Filter by notes which are not yet saved.
    const unsavedNotes = notebookHelpers.getUnsavedNotes(notes);

    // Save each note to the backend.
    for (let index in unsavedNotes) {
      if (unsavedNotes.hasOwnProperty(index)) {
        const note = unsavedNotes[index];
        yield noteSave(note);
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
  yield noteSave(note);
}

/**
 * Helper function.
 * Performs note sync with the backend.
 *
 * @param note
 *   Note object.
 */
function* noteSave(note) {

  // Making sure the request object includes the valid access token.
  const auth = new ClientAuth();
  const accessToken = yield apply(auth, auth.getAccessToken);
  request.set('Authorization', `Bearer ${accessToken}`);

  // Lock logout until update operation for this note is safely completed.
  const lock_id = lock.add('notebook-update-note');

  // Set the note's state to "Is saving".
  yield put(notebookActions.setNoteStateSaving(note.id));

  try {
    // Send backend request to update the note.
    yield notebookHelpers.updateNote(request, note.title, note.body, note.uuid);

    // TODO: DON'T SAVE IF CHANGES WERE MADE WHILE THE NOTE WAS SAVING.

    // Set the note's state to "Saved".
    yield put(notebookActions.setNoteStateSaved(note.id));
  }
  catch (error) {
    // Set the note's state to "Not Saved".
    yield put(notebookActions.setNoteStateNotSaved(note.id));
  }

  lock.release(lock_id);
}
