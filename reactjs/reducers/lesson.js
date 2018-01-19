export default (state = [], action) => {

  console.log('lesson reducer');
  console.log(state);
  console.log(action);

  let index;
  let lesson;

  switch (action.type) {
    case 'LESSON_PROGRESS_SET':

      // Search for the lesson.
      index = state.findIndex(element => element.id === action.lessonId);

      // If the lesson was found, then we should update it.
      if (index !== -1) {
        lesson = state[index];
        lesson.progress = action.progress;

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
          state: action.progress,
        }
      ];

    default:
      return state;
  }
};
