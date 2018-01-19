import { combineReducers } from 'redux';
import course from './course';
import lesson from './lesson';
import navigation from './navigation';

export default combineReducers({
  course,
  lesson,
  navigation
});
