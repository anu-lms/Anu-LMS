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
  `/course${coursePath}${slug}`
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
  let hasQuizzesValue = false;

  lesson.blocks.forEach(block => {
    if (block.type && block.type.indexOf('quiz_') === 0) {
      hasQuizzesValue = true;
    }
  });

  return hasQuizzesValue;
};

/**
 * Checks if the current paragraph is a quiz.
 */
export const blockIsQuiz = block => (
  block.type && block.type.indexOf('quiz_') === 0
);

/**
 * Returns a quiz data for a given quiz
 * from the list of all quizzes data.
 */
export const getQuizData = (quizzesData, blockId) => {
  let data = null;
  // eslint-disable-next-line no-restricted-syntax
  for (let [id, quizData] of Object.entries(quizzesData)) {
    if (parseInt(blockId) === parseInt(id)) { // eslint-disable-line radix
      data = quizData;
    }
  }
  return data;
};

/**
 * Returns a list of IDs of all quizzes from a lesson.
 *
 * @param lesson
 *   Lesson object.
 *
 * @returns {Array}
 */
export const getQuizzesIds = lesson => {
  let ids = [];
  lesson.blocks.forEach(block => {
    if (block.type && block.type.indexOf('quiz_') === 0) {
      ids.push(block.id);
    }
  });
  return ids;
};

/**
 * Returns a bool if the current lesson has synchronized
 * the quizzes data with the backend or not.
 */
export const areQuizzesSaved = (lessons, lessonId) => {
  const index = lessons.findIndex(lesson => lesson.id === lessonId);
  if (index !== -1) {
    if (typeof lessons[index].quizzesSaved !== 'undefined') {
      return lessons[index].quizzesSaved;
    }
  }
  return false;
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
