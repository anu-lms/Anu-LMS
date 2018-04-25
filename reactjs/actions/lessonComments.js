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
