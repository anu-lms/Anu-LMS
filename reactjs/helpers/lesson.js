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

export const isAssessment = lesson => (
  lesson.isAssessment
);

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
