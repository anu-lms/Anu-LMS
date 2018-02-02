export default (state = [], action) => {

  let index;
  let lesson;

  switch (action.type) {
    case 'LESSON_PROGRESS_SET':

      // Search for the lesson.
      index = state.findIndex(element => element.id === action.lessonId);

      // If the lesson was found, then we should update it.
      if (index !== -1) {
        lesson = state[index];

        if (typeof lesson.progress === 'undefined') {
          lesson.progress = 0;
        }

        // Never let the progress go back.
        if (action.progress > lesson.progress) {
          lesson.progress = action.progress;
        }

        return [
          ...state.slice(0, index),
          lesson,
          ...state.slice(index + 1)
        ];
      }

      // If lesson didn't exist before - simply add it.
      return [
        ...state,
        {
          id: action.lessonId,
          progress: action.progress,
        }
      ];

    case 'LESSON_QUIZ_RESULT_SET':

      // Search for the lesson.
      index = state.findIndex(element => element.id === action.lessonId);

      // If the lesson was found, then we should update it.
      if (index !== -1) {
        lesson = state[index];

        if (typeof lesson.quizzesData === 'undefined') {
          lesson.quizzesData = {};
        }

        lesson.quizzesData[action.quizId] = action.quizData;

        return [
          ...state.slice(0, index),
          lesson,
          ...state.slice(index + 1)
        ];
      }

      // If was not found - define a new lesson.
      lesson = {
        id: action.lessonId,
        quizzesData: {}
      };

      // Add a new quiz data.
      lesson.quizzesData[action.quizId] = action.quizData;

      // If lesson didn't exist before - simply add it.
      return [
        ...state,
        lesson,
      ];

    default:
      return state;
  }
};
