import { combineReducers } from 'redux';
import user from './user';
import course from './course';
import lesson from './lesson';
import lessonSidebar from './lessonSidebar';
import notebook from './notebook';
import navigation from './navigation';
import notifications from './notifications';
import lock from './lock';
import search from './search';

const appReducer = combineReducers({
  user,
  course,
  lesson,
  lessonSidebar,
  notebook,
  navigation,
  notifications,
  lock,
  search
});

export default (state, action) => {
  // Reset in-memory state on logout.
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }

  return appReducer(state, action);
};
