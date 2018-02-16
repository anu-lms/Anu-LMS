import { combineReducers } from 'redux';
import course from './course';
import lesson from './lesson';
import notebook from './notebook';
import navigation from './navigation';

export default combineReducers({
  course,
  lesson,
  notebook,
  navigation
});
