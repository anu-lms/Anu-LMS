import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import course from './course';
import lesson from './lesson';
import notebook from './notebook';
import navigation from './navigation';

export default (state, action) => {
  // Clean up storage on user logout (https://stackoverflow.com/a/35641992/3090657).
  if (action.type === 'USER_LOGOUT') {
    Object.keys(state).forEach(key => {
      storage.removeItem(`persist:${key}`);
    });
    state = undefined;
  }

  return appReducer(state, action)
}

const appReducer = combineReducers({
  course,
  lesson,
  notebook,
  navigation
});
