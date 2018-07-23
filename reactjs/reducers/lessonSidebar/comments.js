import _cloneDeep from 'lodash/cloneDeep';

const initialState = {
  paragraphId: 0,
  highlightedComment: null,
  comments: [],
  form: {
    editedComment: null,
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

    case 'LESSON_COMMENTS_HIGHLIGHT_COMMENT':
      return {
        ...state,
        highlightedComment: action.commentId,
      };

    case 'LESSON_COMMENTS_UNHIGHLIGHT_COMMENT':
      return {
        ...state,
        highlightedComment: null,
      };

    case 'LESSON_SIDEBAR_CLOSE':
      return initialState;

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
          editedComment: action.commentId,
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

    case 'LESSON_COMMENTS_HIDE_FORMS':
      return {
        ...state,
        form: initialState.form,
      };

    case 'LESSON_COMMENTS_INSERT_COMMENT_ERROR':
    case 'LESSON_COMMENTS_UPDATE_COMMENT_ERROR':
    case 'LESSON_COMMENTS_DELETE_COMMENT_ERROR':
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
        form: action.resetForm ? initialState.form : state.form,
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
          form: action.resetForm ? initialState.form : state.form,
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
          form: action.resetForm ? initialState.form : state.form,
        };
      }

      // Otherwise return unchanged state.
      return state;
    }

    /**
     * Add an additional flag to the comment if request to mark it as read was initiated.
     */
    case 'LESSON_COMMENTS_MARK_AS_READ': {
      // Search for the comment.
      const index = state.comments.findIndex(element => element.id === action.commentId);

      // Returns default state if comment wasn't found.
      if (index === -1 || state.comments[index].isReadUpdating) {
        return state;
      }

      // If the comment was found, then we should update isRead status.
      return {
        ...state,
        comments: [
          ...state.comments.slice(0, index),
          {
            ...state.comments[index],
            isReadUpdating: true,
          },
          ...state.comments.slice(index + 1),
        ],
      };
    }

    /**
     * Comment was successfully marked as read on backend.
     */
    case 'LESSON_COMMENTS_MARK_AS_READ_SUCCESSFULL': {
      if (action.commentIds.length === 0) {
        return state;
      }

      let comments = _cloneDeep(state.comments);
      action.commentIds.forEach(commentId => {
        // Search for the comment.
        const index = comments.findIndex(element => element.id === commentId);

        // Returns default state if comment wasn't found.
        if (index !== -1 && comments[index].isReadUpdating) {
          comments = [
            ...comments.slice(0, index),
            {
              ...comments[index],
              isReadUpdating: false,
              isReadUpdated: true,
            },
            ...comments.slice(index + 1),
          ];
        }
      });

      // If the comment was found, then we should update isRead status.
      return {
        ...state,
        comments,
      };
    }

    /**
     * Updates isRead comment flag in store to visually show that comment is read.
     */
    case 'LESSON_COMMENTS_MARK_AS_READ_IN_STORE': {
      // Search for the comment.
      const index = state.comments.findIndex(element => element.id === action.commentId);

      // Returns default state if comment wasn't found or already marked as Read.
      if (index === -1 || state.comments[index].isRead) {
        return state;
      }

      // If the comment was found, then we should update isRead status.
      return {
        ...state,
        comments: [
          ...state.comments.slice(0, index),
          {
            ...state.comments[index],
            isRead: true,
          },
          ...state.comments.slice(index + 1),
        ],
      };
    }

    /**
     * Updates isHighlighted comment flag in store to unhighlight the comment.
     */
    case 'LESSON_COMMENTS_MARK_AS_UNHIGHLIGHTED': {
      // Search for the comment.
      const index = state.comments.findIndex(element => element.id === action.commentId);

      // Returns default state if comment wasn't found or already marked as Read.
      if (index === -1 || state.comments[index].isRead) {
        return state;
      }

      // If the comment was found, then we should update isHighlighted status.
      return {
        ...state,
        comments: [
          ...state.comments.slice(0, index),
          {
            ...state.comments[index],
            isHighlighted: false,
          },
          ...state.comments.slice(index + 1),
        ],
      };
    }

    default:
      return state;
  }
};
