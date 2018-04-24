import { combineReducers } from 'redux';
import sidebar from './sidebar';
import notes from './notes';
import comments from './comments';

export default combineReducers({
  sidebar,
  notes,
  comments,
});
