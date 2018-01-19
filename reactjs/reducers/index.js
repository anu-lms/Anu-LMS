import { combineReducers } from 'redux';
import lesson from './lesson';
import navigation from './navigation';

export default combineReducers({
  lesson,
  navigation
});
