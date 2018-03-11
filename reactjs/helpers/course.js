/**
 * Returns progress in course based on lessons progress.
 *
 * @param lessonsStore List of lessons in the redux storage.
 * @param lessons List of lessons in the current course.
 * @returns {number}
 */
export const calculateProgress = (lessonsStore, lessons) => {
  if (lessons.length === 0 || lessonsStore.length === 0) {
    return 0;
  }

  const maxProgressPerLesson = 100 / lessons.length;
  const progress = lessons.reduce((accumulator, lessonId) => {

    const index = lessonsStore.findIndex(lesson => lesson.id === lessonId);

    // If the course was found, then we should update it.
    if (index !== -1) {
      const lessonProgress = lessonsStore[index].progress;
      accumulator += maxProgressPerLesson * lessonProgress / 100;
    }

    return accumulator;
  }, 0);

  return Math.round(progress);
};

/**
 * Get course progress.
 *
 * @param coursesStore
 *   List of courses from Redux storage.
 *
 * @param course
 *   Course object.
 *
 * @returns {number}
 */
export const getProgress = (coursesStore, course) => {
  // If there is no progress in the redux store - simply return value from
  // the backend (or default value).
  if (coursesStore.length === 0) {
    return course.progress;
  }

  // Trying to find the course's progress in the redux store. Return
  // progress from the backend (or default) if not found.
  const index = coursesStore.findIndex(element => element.id === course.id);
  if (index === -1) {
    return course.progress;
  }

  // Always show the highest progress.
  return coursesStore[index].progress > course.progress
    ? coursesStore[index].progress
    : course.progress;
};

/**
 * Returns course url in the frontend app.
 *
 * @param coursePath
 *   Path alias of a course in Drupal backend.
 *
 * @returns {string}
 */
export const getUrl = (coursePath) => (
  '/course' + coursePath
);
