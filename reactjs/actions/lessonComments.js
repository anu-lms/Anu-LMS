/**
 * Set chosen paragraph for Comments.
 */
export const setActiveParagraph = paragraphId => ({
  type: 'LESSON_COMMENTS_SET_ACTIVE_PARAGRAPH',
  paragraphId,
});

/**
 * Hightlight Comment.
 */
export const highlightComment = commentId => ({
  type: 'LESSON_COMMENTS_HIGHLIGHT_COMMENT',
  commentId,
});

/**
 * Unhightlight a Comment.
 */
export const unhighlightComment = () => ({
  type: 'LESSON_COMMENTS_UNHIGHLIGHT_COMMENT',
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
 * Show comment reply form.
 */
export const showReplyForm = commentId => ({
  type: 'LESSON_COMMENTS_SHOW_REPLY_FORM',
  commentId,
});

/**
 * Show comment edit form.
 */
export const showEditForm = commentId => ({
  type: 'LESSON_COMMENTS_SHOW_EDIT_FORM',
  commentId,
});

/**
 * Hide Edit and Reply forms.
 */
export const hideForms = () => ({
  type: 'LESSON_COMMENTS_HIDE_FORMS',
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

/**
 * Send request to the backend to update a comment.
 */
export const updateComment = (commentId, text) => ({
  type: 'LESSON_COMMENTS_UPDATE_COMMENT',
  commentId,
  text,
});

/**
 * Request to update a comment failed.
 */
export const updateCommentError = () => ({
  type: 'LESSON_COMMENTS_UPDATE_COMMENT_ERROR',
});

/**
 * Update comment in the store.
 */
export const updateCommentInStore = comment => ({
  type: 'LESSON_COMMENTS_UPDATE_COMMENT_IN_STORE',
  comment,
});

/**
 * Send request to the backend to delete a comment.
 */
export const deleteComment = commentId => ({
  type: 'LESSON_COMMENTS_DELETE_COMMENT',
  commentId,
});

/**
 * Send request to the backend to mark comment as deleted.
 */
export const markCommentAsDeleted = commentId => ({
  type: 'LESSON_COMMENTS_MARK_AS_DELETED',
  commentId,
});

/**
 * Request to delete a comment failed.
 */
export const deleteCommentError = () => ({
  type: 'LESSON_COMMENTS_DELETE_COMMENT_ERROR',
});

/**
 * Delete comment from the application store.
 */
export const deleteCommentFromStore = commentId => ({
  type: 'LESSON_COMMENTS_DELETE_COMMENT_FROM_STORE',
  commentId,
});

/**
 * Update comments amount for current lesson entity in app store.
 */
export const lessonCommentsAmountSet = (paragraphId, organizationId, amount) => ({
  type: 'LESSON_PARAGRAPH_COMMENTS_AMOUNT_SET',
  paragraphId,
  organizationId,
  amount,
});

/**
 * Send request to the backend to mark comments as read.
 */
export const markCommentAsRead = commentId => ({
  type: 'LESSON_COMMENTS_MARK_AS_READ',
  commentId,
});

/**
 * Update flag in store if comments marked as read successfully.
 */
export const markCommentAsReadSuccessfull = commentIds => ({
  type: 'LESSON_COMMENTS_MARK_AS_READ_SUCCESSFULL',
  commentIds,
});

/**
 * Mark comment as read in store.
 */
export const markCommentAsReadInStore = commentId => ({
  type: 'LESSON_COMMENTS_MARK_AS_READ_IN_STORE',
  commentId,
});
