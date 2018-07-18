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
 * Invokes event when a new live notification arrives through socket. @todo
 */
export const incomingLivePush = (action, comment) => ({
  type: 'LESSON_COMMENTS_INCOMING_LIVE_PUSH',
  action,
  comment,
});
