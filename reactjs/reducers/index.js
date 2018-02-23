import { combineReducers } from 'redux';
import course from './course';
import lesson from './lesson';
import notebook from './notebook';
import navigation from './navigation';
import lock from './lock';
import user from './user';

const appReducer = combineReducers({
  course,
  lesson,
  notebook,
  navigation,
  lock,
  user
});


export default (state, action) => {
  // Reset in-memory state on logout.
  if (action.type === 'RESET_STORE') {
    state = undefined;
  }

  return appReducer(state, action);
}
