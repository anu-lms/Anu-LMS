import { all } from 'redux-saga/effects';
import lessonSagas from './lesson';

export default function* rootSaga () {
  yield all([
    ...lessonSagas()
  ]);
}
