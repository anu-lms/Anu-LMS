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
          ...initialState.form,
          replyTo: action.commentId,
        },
      };

    case 'LESSON_COMMENTS_SHOW_EDIT_FORM':
      return {
        ...state,
        form: {
          ...initialState.form,
          edit: action.commentId,
        },
      };

    case 'LESSON_COMMENTS_INSERT_COMMENT':
    case 'LESSON_COMMENTS_UPDATE_COMMENT':
    case 'LESSON_COMMENTS_DELETE_COMMENT':
      return {
        ...state,
        form: {
          ...state.form,
          isProcessing: true,
        },
      };

    case 'LESSON_COMMENTS_INSERT_COMMENT_ERROR':
    case 'LESSON_COMMENTS_UPDATE_COMMENT_ERROR':
    case 'LESSON_COMMENTS_DELETE_COMMENT_ERROR':
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

    case 'LESSON_COMMENTS_UPDATE_COMMENT_IN_STORE': {
      // Search for the comment.
      const index = state.comments.findIndex(element => element.id === action.comment.id);

      // If the comment was found, then we should update it.
      if (index !== -1) {
        return {
          ...state,
          comments: [
            ...state.comments.slice(0, index),
            action.comment,
            ...state.comments.slice(index + 1),
          ],
          form: initialState.form,
        };
      }

      // Otherwise return unchanged state.
      return state;
    }

    case 'LESSON_COMMENTS_DELETE_COMMENT_FROM_STORE': {
      // Search for the comment.
      const index = state.comments.findIndex(element => element.id === action.commentId);

      // If the comment was found, then we should delete it.
      if (index !== -1) {
        return {
          ...state,
          comments: [
            ...state.comments.slice(0, index),
            ...state.comments.slice(index + 1),
          ],
          form: initialState.form,
        };
      }

      // Otherwise return unchanged state.
      return state;
    }

    default:
      return state;
  }
};
