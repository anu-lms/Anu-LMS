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
  const imageUrl = course.fieldCourseImage ? course.fieldCourseImage.meta.derivatives['576x450'] : 'http://via.placeholder.com/576x450';

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

  let blocks = [];
  if (lesson.fieldLessonBlocks) {
    let counter = 1;
    const regExp = /\/paragraph\/(.+)\//;
    lesson.fieldLessonBlocks.map((block, order) => {

      // Couldn't get paragraph type out of the jsonapi request, therefore
      // have to use this workaround to get the paragraph type from the
      // link to fetch the current paragraph.
      const type = regExp.exec(block.links.self);
      blocks[order] = { type: type[1] };

      // For numbered divider we add automated counter.
      if (type[1] === 'divider_numbered') {
        blocks[order].counter = counter++;
      }

      // Find all props starting with "fieldParagraph" and save their values.
      for (let property in block) {
        if (block.hasOwnProperty(property)) {
          if (property.startsWith('fieldParagraph')) {
            // Remove 'fieldParagraph' prefix.
            const prop = property.substr(14).toLowerCase();
            blocks[order][prop] = block[property];
          }
        }
      }
    });
  }

  return {
    id: lesson.nid,
    uuid: lesson.id,
    url: lessonHelper.getUrl(lesson.fieldLessonCourse.path.alias, lesson.path.alias),
    title: lesson.title,
    blocks
  };
};
