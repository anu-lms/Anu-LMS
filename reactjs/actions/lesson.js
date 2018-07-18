export const setProgress = (lessonId, progress) => ({
  type: 'LESSON_PROGRESS_SET',
  lessonId,
  progress,
});

export const setQuizResult = (lessonId, quizId, quizData) => ({
  type: 'LESSON_QUIZ_RESULT_SET',
  lessonId,
  quizId,
  quizData,
});

export const setQuizzesSaved = lessonId => ({
  type: 'LESSON_QUIZZES_SAVED',
  lessonId,
});

export const opened = lesson => ({
  type: 'LESSON_OPENED',
  lesson,
});

export const closed = lesson => ({
  type: 'LESSON_CLOSED',
  lesson,
});

/**
 * Invokes event when a new live comment update arrives through socket.
 */
export const incomingLivePush = (action, comment) => ({
  type: 'LESSON_COMMENTS_INCOMING_LIVE_PUSH',
  action,
  comment,
});

/**
 * Increase comments amount for current lesson entity in app store.
 */
export const commentsAmountIncrease = (paragraphId, organizationId) => ({
  type: 'LESSON_PARAGRAPH_COMMENTS_AMOUNT_INCREASE',
  paragraphId,
  organizationId,
});

/**
 * Decrease comments amount for current lesson entity in app store.
 */
export const commentsAmountDecrease = (paragraphId, organizationId) => ({
  type: 'LESSON_PARAGRAPH_COMMENTS_AMOUNT_DECREASE',
  paragraphId,
  organizationId,
});

/**
 * Set comments amount for current lesson entity in app store.
 */
export const commentsAmountSet = (paragraphId, organizationId, amount) => ({
  type: 'LESSON_PARAGRAPH_COMMENTS_AMOUNT_SET',
  paragraphId,
  organizationId,
  amount,
});
