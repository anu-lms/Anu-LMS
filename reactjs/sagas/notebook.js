import { all, put, fork, take, takeEvery, select, call, cancel, apply } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import request from '../utils/request';
import * as lock from "../utils/lock";
import * as notebookHelpers from "../helpers/notebook";
import * as notebookActions from "../actions/notebook";
import ClientAuth from "../auth/clientAuth";

/**
 * Amount of milliseconds before frontend will attempt
 * to sync changed with backend (if there are some updates).
 */
  // TODO: CHANGE.
const backendSyncDelay = 4000;

/**
 * Main entry point for all lesson sagas.
 */
export default function* notebookSagas() {
  yield all([
    notebookDataSyncWatcher(),
  ]);
};

/**
 *
 */
function* notebookDataSyncWatcher() {

  yield take('NOTE_ADD');

  while(true) {

    const notes = yield select(state => state.notebook.notes);

    const unsavedNotes = notebookHelpers.getUnsavedNotes(notes);

    for (let index in unsavedNotes) {
      if (unsavedNotes.hasOwnProperty(index)) {

        const note = unsavedNotes[index];

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

          // Set the note's state to "Saved".
          yield put(notebookActions.setNoteStateSaved(note.id));
        }
        catch (error) {
          // Set the note's state to "Not Saved".
          yield put(notebookActions.setNoteStateNotSaved(note.id));
        }

        lock.release(lock_id);
      }
    }

    yield delay(backendSyncDelay);
  }
}
