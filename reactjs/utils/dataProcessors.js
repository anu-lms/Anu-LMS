import { getUrl } from '../helpers/course';

function classData(classData) {
  return {
    uuid: classData.uuid,
    label: classData.label
  }
}

function courseData(courseData) {

  const course = courseData.entityId;
  const imageUrl = course.fieldCourseImage ? course.fieldCourseImage.meta.derivatives['389x292'] : 'http://via.placeholder.com/389x292';

  return {
    uuid: course.uuid,
    gid: courseData.gid.uuid,
    created: course.created,
    title: course.title,
    url: getUrl(course.path.alias ? course.path.alias : '/'),
    imageUrl: imageUrl,
    // TODO: enable image alt.
    imageAlt: course.title,
  };
}

export {
  classData,
  courseData
}
