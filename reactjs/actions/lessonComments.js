/**
 * Set chosen paragraph for Comments.
 */
export const setActiveParagraph = paragraphId => ({
  type: 'LESSON_COMMENTS_SET_ACTIVE_PARAGRAPH',
  paragraphId,
});

/**
 * Make request to the backend to get comments.
 */
export const syncComments = () => ({
  type: 'LESSON_COMMENTS_REQUESTED',
});

/**
 * Request to the backend to get comments failed.
 */
export const syncCommentsFailed = error => ({
  type: 'LESSON_COMMENTS_REQUEST_FAILED',
  error,
});

/**
 * Save received from backend comments to the application store.
 */
export const receiveComments = comments => ({
  type: 'LESSON_COMMENTS_RECEIVED',
  comments,
});

/**
 * Send request to the backend to add a new comment.
 */
export const addComment = (text, parentId = null) => ({
  type: 'LESSON_COMMENTS_INSERT_COMMENT',
  text,
  parentId,
});

/**
 * Request to add a new comment failed.
 */
export const addCommentError = () => ({
  type: 'LESSON_COMMENTS_INSERT_COMMENT_ERROR',
});

/**
 * Add comment to the store.
 */
export const addCommentToStore = comment => ({
  type: 'LESSON_COMMENTS_ADD_COMMENT_TO_STORE',
  comment,
});

// LESSON_COMMENTS_INSERT_COMMENT
// LESSON_COMMENTS_INSERT_COMMENT_ERROR
// LESSON_COMMENTS_ADD_COMMENT_TO_STORE

// LESSON_COMMENTS_UPDATE_COMMENT
// LESSON_COMMENTS_UPDATE_COMMENT_ERROR
// LESSON_COMMENTS_UPDATE_COMMENT_IN_STORE

// LESSON_COMMENTS_DELETE_COMMENT
// LESSON_COMMENTS_DELETE_COMMENT_ERROR
// LESSON_COMMENTS_DELETE_COMMENT_FROM_STORE
