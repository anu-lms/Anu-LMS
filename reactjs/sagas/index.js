import { all } from 'redux-saga/effects';
import lessonSagas from './lesson';
import notebookSagas from './notebook';
import lessonNotebookSagas from './lessonNotebook';
import lessonCommentsSagas from './lessonComments';
import notificationsSagas from './notifications';
import searchSagas from './search';

// @todo: consider to use saga plugin for eslint.
export default function* rootSaga() {
  yield all([
    ...lessonSagas(),
    ...notebookSagas(),
    ...lessonNotebookSagas(),
    ...lessonCommentsSagas(),
    ...notificationsSagas(),
    ...searchSagas(),
  ]);
}
