export const getProgress = (lessons, id) => {
  if (lessons.length === 0) {
    return 0;
  }
  const index = lessons.findIndex(element => element.id === id);
  return index !== -1 ? lessons[index].progress : 0;
};

export const getUrl = (coursePath, slug) => (
  '/course' + coursePath + slug
);

export const getPrevLesson = (lessons, lessonId) => {
  const index = lessons.findIndex(lesson => lesson.id === lessonId);
  if (index - 1 in lessons) {
    return lessons[index - 1];
  }
  return false;
};

export const getNextLesson = (lessons, lessonId) => {
  const index = lessons.findIndex(lesson => lesson.id === lessonId);
  if (index + 1 in lessons) {
    return lessons[index + 1];
  }
  return false;
};
