/**
 * Builds an array of classes from given array of courses
 * who include class metadata.
 *
 * @param courses
 *   Array of course entities from the backend.
 */
export const getClassesFromCourses = (courses) => {
  let classes = [];
  courses.forEach((course) => {
    // Checking if classes array already contains the course's class.
    const index = classes.findIndex(item => item.id === course.groupId);

    // If classes doesn't contain course's class, then add it.
    if (index === -1) {
      classes.push({ id: course.groupId, label: course.groupLabel });
    }
  });

  // Sort alphabetically.
  classes.sort((a, b) => {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
  });

  return classes;
};
