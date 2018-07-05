import _cloneDeep from 'lodash/cloneDeep';

export default (state = { activeLesson: null, lessons: [] }, action) => {
  let index;
  let lesson;

  switch (action.type) {
    case 'LESSON_PROGRESS_SET':

      // Search for the lesson.
      index = state.lessons.findIndex(element => element.id === action.lessonId);

      // If the lesson was found, then we should update it.
      if (index !== -1) {
        lesson = state.lessons[index]; // @todo: double check if it's immutable?

        if (typeof lesson.progress === 'undefined') {
          lesson.progress = 0;
        }

        // Never let the progress go back.
        if (action.progress > lesson.progress) {
          lesson.progress = action.progress;
        }

        return {
          ...state,
          lessons: [
            ...state.lessons.slice(0, index),
            lesson,
            ...state.lessons.slice(index + 1),
          ],
        };
      }

      // If lesson didn't exist before - simply add it.
      return {
        ...state,
        lessons: [
          ...state.lessons,
          {
            id: action.lessonId,
            progress: action.progress,
          },
        ],
      };

    case 'LESSON_QUIZ_RESULT_SET':

      // Search for the lesson.
      index = state.lessons.findIndex(element => element.id === action.lessonId);

      // If the lesson was found, then we should update it.
      if (index !== -1) {
        lesson = state.lessons[index]; // @todo: double check if it's immutable?

        // Create a new quizzes data structure and mark it as not saved
        // on the backend.
        if (typeof lesson.quizzesData === 'undefined') {
          lesson.quizzesData = {};
          lesson.quizzesSaved = false;
        }

        lesson.quizzesData[action.quizId] = action.quizData;

        return {
          ...state,
          lessons: [
            ...state.lessons.slice(0, index),
            lesson,
            ...state.lessons.slice(index + 1),
          ],
        };
      }

      // If was not found - define a new lesson with quizzes data structure
      // marked as not saved on the backend.
      lesson = {
        id: action.lessonId,
        quizzesData: {},
        quizzesSaved: false,
      };

      // Add a new quiz data.
      lesson.quizzesData[action.quizId] = action.quizData;

      // If lesson didn't exist before - simply add it.
      return {
        ...state,
        lessons: [
          ...state.lessons,
          lesson,
        ],
      };

    case 'LESSON_QUIZZES_SAVED':

      // Search for the lesson.
      index = state.lessons.findIndex(element => element.id === action.lessonId);

      // If the lesson was found, then we should update it.
      if (index !== -1) {
        lesson = state.lessons[index]; // @todo: double check if it's immutable?
        lesson.quizzesSaved = true;

        return {
          ...state,
          lessons: [
            ...state.lessons.slice(0, index),
            lesson,
            ...state.lessons.slice(index + 1),
          ],
        };
      }

      // Otherwise return unchanged state, because there should not be a case
      // when quizzes are saved, but no quizzes in the redux store.
      return state;

    case 'LESSON_OPENED': {
      index = state.lessons.findIndex(element => element.id === action.lesson.id);

      const blocks = action.lesson.blocks.map(block => ({
        id: block.id,
        commentsAmount: block.commentsAmount,
      }));

      // If the lesson was found, then we should update it.
      if (index !== -1) {
        return {
          ...state,
          activeLesson: action.lesson.id,
          lessons: [
            ...state.lessons.slice(0, index),
            {
              ...state.lessons[index],
              blocks,
            },
            ...state.lessons.slice(index + 1),
          ],
        };
      }

      // If lesson didn't exist before - simply add it.
      return {
        ...state,
        activeLesson: action.lesson.id,
        lessons: [
          ...state.lessons,
          {
            id: action.lesson.id,
            blocks,
          },
        ],
      };
    }

    case 'LESSON_PARAGRAPH_COMMENTS_AMOUNT_SET': {
      const activeLessonIndex = state.lessons.findIndex(element => element.id === state.activeLesson);
      if (activeLessonIndex !== -1) {
        let activeLesson = _cloneDeep(state.lessons[activeLessonIndex]);
        const activeBlockIndex = activeLesson.blocks.findIndex(element => element.id === action.paragraphId);

        if (activeBlockIndex !== -1) {
          activeLesson.blocks[activeBlockIndex].commentsAmount = {
            ...activeLesson.blocks[activeBlockIndex].commentsAmount,
            [action.organizationId]: action.amount,
          };

          return {
            ...state,
            lessons: [
              ...state.lessons.slice(0, activeLessonIndex),
              activeLesson,
              ...state.lessons.slice(activeLessonIndex + 1),
            ],
          };
        }
      }

      return state;
    }

    default:
      return state;
  }
};
