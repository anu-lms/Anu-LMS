import * as courseHelper from '../helpers/course';
import * as lessonHelper from '../helpers/lesson';

function classData(classData) {
  return {
    uuid: classData.uuid,
    label: classData.label
  }
}

function courseData(courseData) {

  const course = courseData.entityId;
  const imageUrl = course.fieldCourseImage ? course.fieldCourseImage.meta.derivatives['389x292'] : 'http://via.placeholder.com/389x292';

  let lessons = [];
  if (course.fieldCourseLessons.length > 0) {
    lessons = course.fieldCourseLessons.map(lesson => ({
      id: lesson.nid,
      title: lesson.title,
      url: lessonHelper.getUrl(course.path.alias, lesson.path.alias)
    }));
  }

  return {
    uuid: course.uuid,
    gid: courseData.gid.uuid,
    created: course.created,
    title: course.title,
    url: courseHelper.getUrl(course.path.alias),
    imageUrl: imageUrl,
    // TODO: enable image alt.
    imageAlt: course.title,
    lessons: lessons,
  };
}

export {
  classData,
  courseData
}
