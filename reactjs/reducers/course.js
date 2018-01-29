export default (state = [], action) => {

  let index;
  let course;

//  return [];

  switch (action.type) {
    case 'COURSE_PROGRESS_SET':

      // Search for the course.
      index = state.findIndex(element => element.id === action.courseId);

      // If the course was found, then we should update it.
      if (index !== -1) {
        course = state[index];

        // Never let the progress go back.
        if (action.progress > course.progress) {
          course.progress = action.progress;
        }

        return [
          ...state.slice(0, index),
          course,
          ...state.slice(index + 1)
        ];
      }

      // If course didn't exist before - simply add it.
      return [
        ...state,
        {
          id: action.courseId,
          progress: action.progress,
        }
      ];

    default:
      return state;
  }
};
