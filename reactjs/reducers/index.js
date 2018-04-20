import { combineReducers } from 'redux';
import course from './course';
import lesson from './lesson';
import lessonSidebar from './lessonSidebar/sidebar';
import lessonNotebook from './lessonSidebar/notebook';
import lessonComments from './lessonSidebar/comments';
import notebook from './notebook';
import navigation from './navigation';
import lock from './lock';

const appReducer = combineReducers({
  course,
  lesson,
  lessonNotebook,
  lessonSidebar: combineReducers({
    sidebar: lessonSidebar,
    notes: lessonNotebook,
    comments: lessonComments,
  }),
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
