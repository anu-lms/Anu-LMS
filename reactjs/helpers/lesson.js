/**
 * Returns progress for the lesson.
 *
 * @param storeLessons
 * @param lesson
 * @returns {number}
 */
export const getProgress = (storeLessons, lesson) => {
  // If there is no progress in the redux store - simply return value from
  // the backend (or default value).
  if (storeLessons.length === 0) {
    return lesson.progress;
  }

  // Trying to find the lesson's progress in the redux store. Return
  // progress from the backend (or default) if not found.
  const index = storeLessons.findIndex(element => element.id === lesson.id);
  if (index === -1) {
    return lesson.progress;
  }

  // Always show the highest progress.
  return storeLessons[index].progress > lesson.progress
    ? storeLessons[index].progress
    : lesson.progress;
};

/**
 * Return lesson's path on the frontend.
 *
 * @param coursePath
 *   Path of the course on the frontend.
 *
 * @param slug
 *   Path alias of the lesson on the backend with leading slash.
 *
 * @returns {string}
 */
export const getUrl = (coursePath, slug) => (
  '/course' + coursePath + slug
);

/**
 * Checks if the current lesson is assessment.
 */
export const isAssessment = lesson => (
  lesson.isAssessment
);

/**
 * Checks if the current lesson has quizzes included.
 */
export const hasQuizzes = lesson => {
  let hasQuizzes = false;

  lesson.blocks.forEach(block => {
    if (block.type && block.type.indexOf('quiz_') === 0) {
      hasQuizzes = true;
    }
  });

  return hasQuizzes;
};

export const getQuizzesData = (lessons, lessonId) => {
  const index = lessons.findIndex(lesson => lesson.id === lessonId);
  if (index !== -1) {
    if (typeof lessons[index].quizzesData !== 'undefined') {
      return lessons[index].quizzesData;
    }
  }
  return {};
};

export const getNextLesson = (lessons, lessonId) => {
  const index = lessons.findIndex(lesson => lesson.id === lessonId);
  if (index + 1 in lessons) {
    return lessons[index + 1];
  }
  return false;
};
