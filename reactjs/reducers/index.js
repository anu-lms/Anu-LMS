import { combineReducers } from 'redux';
import course from './course';
import lesson from './lesson';
import lessonNotebook from './lessonNotebook';
import lessonSidebar from './lessonSidebar';
import notebook from './notebook';
import navigation from './navigation';
import lock from './lock';

const appReducer = combineReducers({
  course,
  lesson,
  lessonNotebook,
  lessonSidebar,
  notebook,
  navigation,
  lock,
});


export default (state, action) => {
  // Reset in-memory state on logout.
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }

  return appReducer(state, action);
};
