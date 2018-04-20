export default (state = {
  paragraphId: 0,
}, action) => {
  switch (action.type) {
    case 'LESSON_COMMENTS_SET_ACTIVE_PARAGRAPH':
      return {
        ...state,
        paragraphId: action.paragraphId,
      };
    default:
      return state;
  }
};
