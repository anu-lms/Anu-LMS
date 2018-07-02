import * as courseHelper from '../helpers/course';
import * as lessonHelper from '../helpers/lesson';
import * as urlUtils from './url';
import { humanizeFileName } from './string';

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
      // @todo: replace with helper function.
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
 *
 * @todo: Improve names of functions (entityData or processEntity),
 * consider to move to separate folder.
 */
const processParagraphs = paragraphs => {
  let blocks = [];
  let counter = 1;
  const regExp = /\/paragraph\/(.+)\//;
  paragraphs.forEach((block, order) => {
    // Couldn't get paragraph type out of the jsonapi request, therefore
    // have to use this workaround to get the paragraph type from the
    // link to fetch the current paragraph.
    let type = block.type ? block.type : null;
    if (!type) {
      const regType = regExp.exec(block.links.self);
      type = regType[1]; // eslint-disable-line prefer-destructuring
    }

    blocks[order] = {
      type,
      id: block.id,
    };

    // For numbered divider we add automated counter.
    if (type === 'divider_numbered') {
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
  let blocks = [];
  if (lessonDataObject.fieldLessonBlocks) {
    blocks = processParagraphs(lessonDataObject.fieldLessonBlocks);
  }

  return {
    id: lessonDataObject.nid,
    uuid: lessonDataObject.uuid,
    // eslint-disable-next-line max-len
    url: lessonHelper.getUrl(lessonDataObject.fieldLessonCourse.path.alias, lessonDataObject.path.alias),
    title: lessonDataObject.title,
    isAssessment: lessonDataObject.fieldIsAssessment ? lessonDataObject.fieldIsAssessment : false,
    progress: 0,
    blocks,
  };
};

/**
 * Internal helper to normalize notebook note data from the backend.
 */
export const notebookData = note => ({
  id: note.id,
  uuid: note.uuid,
  created: note.created,
  changed: note.changed,
  title: note.fieldNotebookTitle ? note.fieldNotebookTitle : '',
  body: note.fieldNotebookBody ? note.fieldNotebookBody.value : '',
});

/**
 * Internal helper to normalize resource data from the backend.
 */
export const resourceData = rawResource => {
  const resource = {
    id: rawResource.id,
    uuid: rawResource.uuid,
    title: rawResource.fieldParagraphTitle,
  };

  // Use Normalized file name if title field is empty.
  if (!rawResource.fieldParagraphTitle) {
    resource.title = humanizeFileName(rawResource.file.filename);
  }

  if (rawResource.lesson) {
    resource.lesson = lessonData(rawResource.lesson);
  }

  return resource;
};

/**
 * Internal helper to normalize list of notebook notes from the backend.
 */
export const notebookListData = notebookDataObject =>
  // Custom mapping for notebook notes.
  notebookDataObject.map(note => (notebookData(note)));

/**
 * Internal helper to normalize User data from the backend.
 */
export const userData = userDataObject => ({
  uid: userDataObject.uid,
  uuid: userDataObject.uuid,
  name: userDataObject.name,
  mail: userDataObject.mail,
  status: userDataObject.status,
  created: userDataObject.created,
  changed: userDataObject.changed,
  roles: userDataObject.roles,
  firstName: userDataObject.fieldFirstName ? userDataObject.fieldFirstName : '',
  lastName: userDataObject.fieldLastName ? userDataObject.fieldLastName : '',
  organization: userDataObject.fieldOrganization ? userDataObject.fieldOrganization : [],
});

/**
 * Internal helper to normalize Comment data from the backend.
 */
export const processComment = rawComment => {
  const comment = {
    id: rawComment.id,
    uuid: rawComment.uuid,
    created: rawComment.created,
    changed: rawComment.changed,
    text: rawComment.fieldCommentText ? rawComment.fieldCommentText.value : '',
    parentId: rawComment.fieldCommentParent ? rawComment.fieldCommentParent.id : null,
    paragraphId: rawComment.fieldCommentParagraph,
    deleted: rawComment.fieldCommentDeleted ? rawComment.fieldCommentDeleted : false,
  };

  if (rawComment.uid && rawComment.uid.uid) {
    comment.author = {
      uid: rawComment.uid.uid,
      name: rawComment.uid.name,
      firstName: rawComment.uid.fieldFirstName || '',
      lastName: rawComment.uid.fieldLastName || '',
    };
  }

  if (rawComment.lesson) {
    comment.lesson = lessonData(rawComment.lesson);

    comment.url = `${comment.lesson.url}?comment=${comment.paragraphId}-${comment.id}`;
  }

  return comment;
};

/**
 * Internal helper to normalize Notification data from the backend.
 *
 * @todo: all process functions should eather process an array or object.
 */
export const processNotifications = Notifications => (
  Notifications.map(rawNotification => {
    const notification = {
      ...rawNotification,
      triggerer: userData(rawNotification.triggerer),
    };

    if (rawNotification.comment) {
      notification.comment = processComment(rawNotification.comment);
    }

    return notification;
  })
);
