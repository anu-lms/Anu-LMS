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

export const getProgress = (coursesStore, id) => {
  if (coursesStore.length === 0) {
    return 0;
  }
  const index = coursesStore.findIndex(element => element.id === id);
  return index !== -1 ? coursesStore[index].progress : 0;
};

export const getUrl = (coursePath) => (
  '/course' + coursePath
);
