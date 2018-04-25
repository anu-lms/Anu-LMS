export default (state = {
  paragraphId: 0,
  comments: [],
}, action) => {
  switch (action.type) {
    case 'LESSON_COMMENTS_SET_ACTIVE_PARAGRAPH':
      return {
        ...state,
        paragraphId: action.paragraphId,
      };

    case 'LESSON_SIDEBAR_CLOSE':
      return {
        ...state,
        paragraphId: 0,
      };

    case 'LESSON_OPENED':
      return {
        ...state,
        paragraphId: 0,
      };

    case 'LESSON_COMMENTS_RECEIVED':
      return {
        ...state,
        comments: action.comments,
      };

    default:
      return state;
  }
};
