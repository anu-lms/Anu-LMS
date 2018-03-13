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

  // Figure out how much progress to the course can add 1 lesson if it is
  // 100% completed.
  const maxProgressPerLesson = 100 / lessons.length;

  // Run through all course lessons and calculate total progress.
  const progress = lessons.reduce((accumulator, lesson) => {

    // Find a lesson progress in the redux store.
    const index = lessonsStore.findIndex(lessonStore => lessonStore.id === lesson.id);

    // By default set the lesson progress equals progress from the backend.
    let lessonProgress = lesson.progress;

    // If the local storage contains lesson with progress greater than the
    // progress from the backend, then we should use it.
    if (index !== -1) {
      if (lessonsStore[index].progress > lessonProgress) {
        lessonProgress = lessonsStore[index].progress;
      }
    }

    // Accumulate the course progress using progress of each lesson.
    accumulator += maxProgressPerLesson * lessonProgress / 100;
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
