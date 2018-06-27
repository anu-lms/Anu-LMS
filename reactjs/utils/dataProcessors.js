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

/**
 * Internal helper to process course data from the backend.
 */
export const courseData = course => {
  // Build out the right lessons urls.
  const lessons = course.lessons.map(lesson => ({
    ...lesson,
    url: lessonHelper.getUrl(course.url, lesson.url),
  }));

  return {
    ...course,
    lessons,
    url: courseHelper.getUrl(course.url),
    urlResources: courseHelper.getResourcesUrl(course.url),
    imageUrl: course.coverImage ? urlUtils.fileUrl(course.coverImage) : '',
    imageAlt: course.title, // TODO: enable image alt.
  };
};

/**
 * Internal helper to process lesson data from the backend.
 */
export const lessonData = lesson => {
  return {
    id: lesson.nid,
    uuid: lesson.uuid,
    // eslint-lesson-next-line max-len
    url: lessonHelper.getUrl(lesson.fieldLessonCourse.path.alias, lesson.path.alias),
    title: lesson.title,
    isAssessment: lesson.fieldIsAssessment ? lesson.fieldIsAssessment : false,
    progress: 0,
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

  // Organization isn't required field.
  if (userDataObject.field_organization[0] !== undefined) {
    data.organization = userDataObject.field_organization[0].target_id;
  }

  if (userDataObject.field_first_name[0] !== undefined) {
    data.firstName = userDataObject.field_first_name[0].value;
  }

  if (userDataObject.field_last_name[0] !== undefined) {
    data.lastName = userDataObject.field_last_name[0].value;
  }
  return data;
};

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
