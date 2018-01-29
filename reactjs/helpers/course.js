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
 * Return a first lesson without 100% read completion in a course.
 *
 * @param storeLessons
 *   Array of lessons with progress from Redux storage.
 *
 * @param courseLessons
 *   Array of lessons per course.
 *
 * @returns {boolean}
 */
export const getLessonToResume = (storeLessons, courseLessons) => {

  let progressExists = false;

  const matchedLessons = courseLessons.filter(lesson => {

    let index = storeLessons.findIndex(element =>
      element.id === lesson.id
    );

    if (index !== -1) {

      let storeLesson = storeLessons[index];
      if (storeLesson.progress > 0) {
        progressExists = true;
      }

      if (progressExists && storeLesson.progress < 100) {
        return lesson;
      }
    }
    else if (progressExists) {
      return lesson;
    }

  });

  return matchedLessons.length > 0 ? matchedLessons[0] : false;
};

/**
 * Get course progress.
 *
 * @param coursesStore
 *   List of courses from Redux storage.
 *
 * @param id
 *   Course ID.
 *
 * @returns {number}
 */
export const getProgress = (coursesStore, id) => {
  if (coursesStore.length === 0) {
    return 0;
  }
  const index = coursesStore.findIndex(element => element.id === id);
  return index !== -1 ? coursesStore[index].progress : 0;
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
