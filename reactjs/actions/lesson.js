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

export const opened = lesson => ({
  type: 'LESSON_OPENED',
  lesson,
});

export const closed = lesson => ({
  type: 'LESSON_CLOSED',
  lesson,
});
