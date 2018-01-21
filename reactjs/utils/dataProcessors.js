import * as courseHelper from '../helpers/course';
import * as lessonHelper from '../helpers/lesson';
import * as urlUtils from '../utils/url';

export const classData = (classData) => {
  return {
    uuid: classData.uuid,
    label: classData.label
  }
};

export const courseData = (courseData) => {

  const course = courseData.entityId;
  const imageUrl = course.fieldCourseImage ? course.fieldCourseImage.meta.derivatives['389x292'] : 'http://via.placeholder.com/389x292';

  let lessons = [];
  if (course.fieldCourseLessons) {
    lessons = course.fieldCourseLessons.map(lesson => ({
      id: lesson.nid,
      title: lesson.title,
      url: lessonHelper.getUrl(course.path.alias, lesson.path.alias)
    }));
  }

  return {
    id: course.nid,
    uuid: course.uuid,
    gid: courseData.gid.uuid,
    created: course.created,
    title: course.title,
    url: courseHelper.getUrl(course.path.alias),
    imageUrl: urlUtils.fileUrl(imageUrl),
    // TODO: enable image alt.
    imageAlt: course.title,
    lessons: lessons,
  };
};

export const lessonData = (lessonData) => {

  const lesson = lessonData.entityId;

  return {
    id: lesson.nid,
    uuid: lesson.id,
    url: lessonHelper.getUrl(lesson.fieldLessonCourse.path.alias, lesson.path.alias),
    title: lesson.title,
  };
};
