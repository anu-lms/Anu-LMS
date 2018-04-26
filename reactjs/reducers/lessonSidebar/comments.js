export default (state = {
  paragraphId: 0,
  comments: [],
  form: {
    edit: null,
    replyTo: null,
    isProcessing: false,
  },
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

    case 'LESSON_COMMENTS_INSERT_COMMENT':
      return {
        ...state,
        form: {
          ...state.form,
          isProcessing: true,
        },
      };

    case 'LESSON_COMMENTS_INSERT_COMMENT_ERROR':
      return {
        ...state,
        form: {
          ...state.form,
          isProcessing: false,
        },
      };

    // Adds given comment to the store.
    case 'LESSON_COMMENTS_ADD_COMMENT_TO_STORE':

      return {
        ...state,
        comments: [
          ...state.comments,
          action.comment,
        ],
        form: {
          ...state.form,
          isProcessing: false,
        },
      };

    default:
      return state;
  }
};
