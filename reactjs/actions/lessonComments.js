export const setActiveParagraph = paragraphId => ({
  type: 'LESSON_COMMENTS_SET_ACTIVE_PARAGRAPH',
  paragraphId,
});

export const syncComments = () => ({
  type: 'LESSON_COMMENTS_REQUESTED',
});

export const syncCommentsFailed = error => ({
  type: 'LESSON_COMMENTS_REQUEST_FAILED',
  error,
});

export const receiveComments = comments => ({
  type: 'LESSON_COMMENTS_RECEIVED',
  comments,
});
