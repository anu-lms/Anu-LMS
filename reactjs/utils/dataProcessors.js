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

  let instructors = [];
  if (course.fieldCourseInstructors) {
    instructors = course.fieldCourseInstructors.map(user => ({
      uuid: user.uuid,
      realname: `${user.fieldFirstName} ${user.fieldLastName}`
    }));
  }

  let organizationName = '';
  if (course.fieldCourseOrganisation) {
    organizationName = course.fieldCourseOrganisation.name;
  }

  let estimation = 0;
  if (course.fieldTimeToCompleteMinutes) {
    estimation = course.fieldTimeToCompleteMinutes;
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
    organisation: organizationName,
    instructors: instructors,
    totalMinutes: estimation,
    description: course.fieldCourseDescription ? course.fieldCourseDescription.value : ''
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

  // TODO: REMOVE TEST BLOCKS WHEN BACKEND IS DONE.
  blocks.push({
    type: 'quiz_checkboxes',
    title: 'Test Checkbox Quiz',
    id: '1232131313',
    list: [
      {
        id: '12312983671',
        label: 'Option 1',
      },
      {
        id: '123129836713',
        label: 'Option 2',
      },
      {
        id: '123129836712',
        label: 'Option 3',
      },
    ],
    blocks: [
      {
        type: 'image_centered_caption',
        title: 'Some demo caption',
        image: {
          url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg',
          meta: {
            derivatives: {
              w730: 'https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg',
            },
          },
        },
      },
      {
        type: 'image_centered_caption',
        title: 'Some demo caption',
        image: {
          url: 'https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg',
          meta: {
            derivatives: {
              w730: 'https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg',
            },
          },
        },
      }
    ]
  });

  blocks.push({
    type: 'quiz_comboboxes',
    title: 'Test Combo Box Quiz',
    id: '1232131313123',
    list: [
      {
        id: '12312983671123',
        label: 'Option 1',
      },
      {
        id: '123129836711234',
        label: 'Option 2',
      },
      {
        id: '123129836711235',
        label: 'Option 3',
      },
    ],
  });

  blocks.push({
    type: 'quiz_textarea',
    title: 'Test Free Text Quiz',
    id: '12321313133213',
  });

  blocks.push({
    type: 'quiz_linear_scale',
    title: 'Test Linear Scale Quiz',
    id: '123213131343312',
    from: 0,
    to: 100,
    labelFrom: 'Label from',
    labelTo: 'Label to',
  });

  return {
    id: lesson.nid,
    uuid: lesson.id,
    url: lessonHelper.getUrl(lesson.fieldLessonCourse.path.alias, lesson.path.alias),
    title: lesson.title,
    blocks
  };
};
