import { all } from 'redux-saga/effects';
import lessonSagas from './lesson';
import notebookSagas from './notebook';

export default function* rootSaga () {
  yield all([
    ...lessonSagas(),
    ...notebookSagas(),
  ]);
}
