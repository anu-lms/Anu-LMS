const initialState = {
  paragraphId: 0,
  comments: [],
  form: {
    edit: null,
    replyTo: null,
    isProcessing: false,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LESSON_COMMENTS_SET_ACTIVE_PARAGRAPH':
      return {
        ...state,
        paragraphId: action.paragraphId,
        form: initialState.form,
      };

    case 'LESSON_SIDEBAR_CLOSE':
      return {
        ...state,
        paragraphId: 0,
        form: initialState.form,
      };

    case 'LESSON_OPENED':
      return {
        ...state,
        paragraphId: 0,
        form: initialState.form,
      };

    case 'LESSON_COMMENTS_RECEIVED':
      return {
        ...state,
        comments: action.comments,
        form: initialState.form,
      };

    case 'LESSON_COMMENTS_SHOW_REPLY_FORM':
      return {
        ...state,
        form: {
          ...state.form,
          edit: null,
          replyTo: action.commentId,
          isProcessing: false,
        },
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
        form: initialState.form,
      };

    // Adds given comment to the store.
    case 'LESSON_COMMENTS_ADD_COMMENT_TO_STORE':

      return {
        ...state,
        comments: [
          ...state.comments,
          action.comment,
        ],
        form: initialState.form,
      };

    default:
      return state;
  }
};
