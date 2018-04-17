import * as courseHelper from '../helpers/course';
import * as lessonHelper from '../helpers/lesson';
import * as urlUtils from '../utils/url';

/**
 * Processes data of a course from custom REST endpoint.
 */
export const courseDataFromREST = course => ({
  id: parseInt(course.id, 10),
  title: course.label,
  imageUrl: urlUtils.fileUrl(course.image),
  imageAlt: course.label,
  url: courseHelper.getUrl(course.path),
  urlResources: courseHelper.getResourcesUrl(course.path),
  progress: course.progress || 0,
  recentLessonUrl: course.recentLesson ? courseHelper.getUrl(course.path) + course.recentLesson.url : '',
  recentAccess: course.recentLesson ? course.recentLesson.timestamp : 0,
});

export const courseData = courseDataObject => {
  const course = courseDataObject.entityId;
  const imageUrl = course.fieldCourseImage ? course.fieldCourseImage.meta.derivatives['576x450'] : 'http://via.placeholder.com/576x450';

  let lessons = [];
  if (course.fieldCourseLessons) {
    lessons = course.fieldCourseLessons.map(lesson => ({
      id: lesson.nid,
      title: lesson.title,
      url: lessonHelper.getUrl(course.path.alias, lesson.path.alias),
      progress: 0,
    }));
  }

  let instructors = [];
  if (course.fieldCourseInstructors) {
    instructors = course.fieldCourseInstructors.map(user => {
      let realname = '';
      if (user.fieldFirstName) {
        realname = user.fieldFirstName;
      }

      if (user.fieldLastName) {
        realname += ` ${user.fieldLastName}`;
      }

      return {
        uuid: user.uuid,
        realname: realname.trim(),
      };
    });
  }

  let organizationName = '';
  if (course.fieldCourseOrganisation) {
    organizationName = course.fieldCourseOrganisation.name;
  }

  let estimation = 0;
  if (course.fieldTimeToCompleteMinutes) {
    estimation = course.fieldTimeToCompleteMinutes;
  }

  let hasResources = false;
  if (course.fieldCourseHasResources) {
    hasResources = course.fieldCourseHasResources;
  }

  return {
    id: course.nid,
    groupId: courseDataObject.gid.id ? courseDataObject.gid.id : null,
    groupLabel: courseDataObject.gid.label ? courseDataObject.gid.label : null,
    created: course.created,
    title: course.title,
    url: courseHelper.getUrl(course.path.alias),
    urlResources: courseHelper.getResourcesUrl(course.path.alias),
    imageUrl: urlUtils.fileUrl(imageUrl),
    // TODO: enable image alt.
    imageAlt: course.title,
    lessons,
    organisation: organizationName,
    instructors,
    totalMinutes: estimation,
    description: course.fieldCourseDescription ? course.fieldCourseDescription.value : '',
    hasResources,
    progress: 0, // Default value.
  };
};

/**
 * Internal helper to process paragraphs data from the backend.
 */
const processParagraphs = paragraphs => {
  let blocks = [];
  let counter = 1;
  const regExp = /\/paragraph\/(.+)\//;
  paragraphs.forEach((block, order) => {
    // Couldn't get paragraph type out of the jsonapi request, therefore
    // have to use this workaround to get the paragraph type from the
    // link to fetch the current paragraph.
    const type = regExp.exec(block.links.self);

    blocks[order] = {
      type: type[1],
      id: block.id,
    };

    // For numbered divider we add automated counter.
    if (type[1] === 'divider_numbered') {
      blocks[order].counter = counter++; // eslint-disable-line no-plusplus
    }

    // Find all props starting with "fieldParagraph" and save their values.
    for (let property in block) { // eslint-disable-line no-restricted-syntax
      if (block.hasOwnProperty(property)) { // eslint-disable-line no-prototype-builtins
        let prop = '';

        if (property.startsWith('fieldParagraph')) {
          // Remove 'fieldParagraph' prefix.
          prop = property.substr(14).toLowerCase();
        }
        else
        if (property.startsWith('fieldQuiz')) {
          // Remove 'fieldQuiz' prefix.
          prop = property.substr(9).toLowerCase();
        }

        if (prop === 'blocks') {
          blocks[order][prop] = processParagraphs(block[property]);
        }

        else if (prop) {
          blocks[order][prop] = block[property];
        }
      }
    }
  });

  // Custom mapping for linear scale fields.
  blocks = blocks.map(block => {
    if (block.type === 'quiz_linear_scale') {
      block.from = block.linearscalefrom;
      block.to = block.linearscaleto;
    }

    return block;
  });

  return blocks;
};

export const lessonData = lessonDataObject => {
  const lesson = lessonDataObject.entityId;

  let blocks = [];
  if (lesson.fieldLessonBlocks) {
    blocks = processParagraphs(lesson.fieldLessonBlocks);
  }

  return {
    id: lesson.nid,
    uuid: lesson.id,
    url: lessonHelper.getUrl(lesson.fieldLessonCourse.path.alias, lesson.path.alias),
    title: lesson.title,
    isAssessment: lesson.fieldIsAssessment ? lesson.fieldIsAssessment : false,
    progress: 0,
    blocks,
  };
};

/**
 * Internal helper to normalize notebook notes data from the backend.
 */
export const notebookData = notebookDataObject =>
  // Custom mapping for notebook notes.
  notebookDataObject.map(note => ({
    id: note.id,
    uuid: note.uuid,
    created: note.created,
    changed: note.changed,
    title: note.fieldNotebookTitle ? note.fieldNotebookTitle : '',
    body: note.fieldNotebookBody ? note.fieldNotebookBody.value : '',
  }));

/**
 * Internal helper to normalize User data from the backend.
 */
export const userData = userDataObject => {
  let data = {
    uid: userDataObject.uid[0].value,
    uuid: userDataObject.uuid[0].value,
    name: userDataObject.name[0].value,
  };
  // Anonymous don't get user object with mail property.
  if (userDataObject.mail !== undefined) {
    data.mail = userDataObject.mail[0].value;
  }
  return data;
};
