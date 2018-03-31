import { all } from 'redux-saga/effects';
import lessonSagas from './lesson';
import notebookSagas from './notebook';
import lessonNotebookSagas from './lessonNotebook';

export default function* rootSaga() {
  yield all([
    ...lessonSagas(),
    ...notebookSagas(),
    ...lessonNotebookSagas(),
  ]);
}
