import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import urlParse from 'url-parse';
import Alert from 'react-s-alert';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import * as dataProcessors from '../utils/dataProcessors';
import LessonPageTemplate from '../components/organisms/Templates/Lesson';
import SiteTemplate from '../components/organisms/Templates/SiteTemplate';
import * as lessonSidebarActions from '../actions/lessonSidebar';
import * as mediaBreakpoint from '../utils/breakpoints';
import * as navigationActions from '../actions/navigation';
import * as lessonCommentsActions from '../actions/lessonComments';

class LessonPage extends React.Component {
  static async getInitialProps({ request, query, res }) {
    const initialProps = {
      course: {},
      lesson: {},
      statusCode: 200,
    };

    // TODO: Handle case when path alias was changed.

    // Get a course by path.
    let response;
    try {
      response = await request
        .get('/router/translate-path')
        .query({
          '_format': 'json',
          'path': query.course,
        });

      const { entity } = response.body;

      // Make sure course was found.
      if (entity.type !== 'node' || entity.bundle !== 'course') {
        console.log('Could not find the course under with the given URL.');
        if (res) res.statusCode = 404;
        initialProps.statusCode = 404;
        return initialProps;
      }

      const responseCourse = await request
        .get('/jsonapi/group_content/class-group_node-course')
        .query({
          // Include class group, course entity, course image.
          'include': 'gid,entity_id,entity_id.field_course_image,entity_id.field_course_lessons',
          // Course entity fields.
          'fields[node--course]': 'title,path,nid,uuid,field_course_image,field_course_lessons,field_course_has_resources,created',
          // Lesson entity fields.
          'fields[node--lesson]': 'title,path,nid',
          // Course image fields.
          'fields[file--image]': 'url',
          // Class group fields.
          'fields[group--class]': 'uuid,label',
          // Filter by nid.
          'filter[entity_id][value]': entity.id,
        });

      // 403 Errors from this response can't be catches with simple catch,
      // so we check response body for errors and throw an error.
      if (responseCourse.body.data.length === 0 && responseCourse.body.meta &&
        responseCourse.body.meta.errors && responseCourse.body.meta.errors[0].status) {
        initialProps.statusCode = responseCourse.body.meta.errors[0].status;
        throw Error(responseCourse.meta.errors[0].detail);
      }

      initialProps.course = dataProcessors.courseData(responseCourse.body.data[0]);
    } catch (error) {
      console.log('Could not load course.', error);
      initialProps.statusCode = initialProps.statusCode !== 200 ? initialProps.statusCode : 500;

      if (res) res.statusCode = initialProps.statusCode;
      return initialProps;
    }

    // Get a lesson by path.
    // TODO: check if course is parent of lesson.
    try {
      response = await request
        .get('/router/translate-path')
        .query({
          '_format': 'json',
          'path': query.lesson,
        });

      const { entity } = response.body;

      // Make sure the lesson was found.
      if (entity.type !== 'node' || entity.bundle !== 'lesson') {
        console.log('Could not find the lesson under with the given URL.');
        if (res) res.statusCode = 404;
        initialProps.statusCode = 404;
        return initialProps;
      }

      const responseLesson = await request
        .get('/jsonapi/group_content/class-group_node-lesson')
        .query({
          // Include referenced fields.
          'include': '' +
          'entity_id,' +
          'entity_id.field_lesson_course,' +
          'entity_id.field_lesson_blocks,' +
          'entity_id.field_lesson_blocks.field_paragraph_image,' +
          'entity_id.field_lesson_blocks.field_paragraph_file,' +
          'entity_id.field_lesson_blocks.field_paragraph_private_file,' +
          'entity_id.field_lesson_blocks.field_quiz_blocks,' +
          'entity_id.field_lesson_blocks.field_quiz_blocks.field_paragraph_image,' +
          'entity_id.field_lesson_blocks.field_quiz_blocks.field_paragraph_file',
          // Lesson entity fields.
          'fields[node--lesson]': 'title,path,nid,uuid,field_lesson_course,field_lesson_blocks,field_is_assessment',
          // Course entity fields.
          'fields[node--course]': 'path,nid',
          // Filter by nid.
          'filter[entity_id][value]': entity.id,
        });

      // 403 Errors from this response can't be catches with simple catch,
      // so we check response body for errors and throw an error.
      if (responseLesson.body.data.length === 0 && responseLesson.body.meta &&
        responseLesson.body.meta.errors && responseLesson.body.meta.errors[0].status) {
        initialProps.statusCode = responseLesson.body.meta.errors[0].status;
        throw Error(responseLesson.meta.errors[0].detail);
      }
      else if (responseLesson.body.data.length === 0) {
        initialProps.statusCode = 404;
        throw Error(`Lesson with id ${entity.id} not found`);
      }

      initialProps.lesson = dataProcessors.lessonData(responseLesson.body.data[0].entityId);
    } catch (error) {
      console.log('Could not load lesson.', error);
      if (error.status) {
        initialProps.statusCode = error.status;
      }
      else {
        initialProps.statusCode = initialProps.statusCode !== 200 ? initialProps.statusCode : 500;
      }

      if (res) res.statusCode = initialProps.statusCode;
      return initialProps;
    }

    try {
      // Fetch data regarding the course progress from the backend.
      response = await request
        .get(`/learner/progress/${initialProps.course.id}`)
        .query({ '_format': 'json' });

      const progress = response.body;

      // Add information about the course progress to the course object.
      initialProps.course.progress = Math.round(progress.course);

      // Add information about the lessons progress to the appropriate objects.
      Object.entries(progress.lessons).forEach(([id, lessonProgress]) => {
        const lessonId = parseInt(id); // eslint-disable-line radix
        const index = initialProps.course.lessons.findIndex(lesson => lesson.id === lessonId);
        if (index !== -1) {
          initialProps.course.lessons[index].progress = Math.round(lessonProgress);
        }

        // Add lesson progress to the currently viewing lesson.
        if (parseInt(id) === initialProps.lesson.id) { // eslint-disable-line radix
          initialProps.lesson.progress = Math.round(lessonProgress);
        }
      });
    } catch (error) {
      // Log error but still render the page, because this issue is not a
      // deal breaker to display course content.
      console.log('Could not fetch course progress.', error);
    }

    return initialProps;
  }

  componentDidMount() {
    this.hightlightComment();
  }

  componentDidUpdate() {
    this.hightlightComment();
  }

  // @todo: consider to move it to comments related components.
  hightlightComment() {
    const { dispatch, isStoreRehydrated, lesson } = this.props;

    // If user was redirected to 403 page.
    if (!lesson || !lesson.blocks) {
      return;
    }

    if (isStoreRehydrated) {
      const parsedUrl = urlParse(window.location.href, true);
      if (parsedUrl.query.length === 0 || !parsedUrl.query.comment) {
        return;
      }

      const urlParams = parsedUrl.query.comment.split('-');
      if (!urlParams[0] || !urlParams[1]) {
        return;
      }

      const paragraphId = parseInt(urlParams[0], 10);
      const commentId = parseInt(urlParams[1], 10);

      const index = lesson.blocks.findIndex(block => block.id === paragraphId);
      if (index === -1) {
        Alert.error("Referenced in url comment doesn't exists");
        console.error("Referenced paragraph doesn't exists", `Lesson: ${lesson.id}`, `Paragraph: ${paragraphId}`);
        return;
      }

      // Set active paragraph.
      dispatch(lessonCommentsActions.setActiveParagraph(paragraphId));

      // Highlight a comment.
      dispatch(lessonCommentsActions.highlightComment(commentId));

      // Let the application know that the sidebar is being opened.
      dispatch(lessonSidebarActions.open('comments'));

      // If sidebar is opened, close navigation pane on all devices except extra
      // large.
      if (mediaBreakpoint.isDown('xxl')) {
        dispatch(navigationActions.close());
      }
    }
  }

  render() {
    const { statusCode, lesson, course } = this.props;
    return (
      <SiteTemplate className="lesson" statusCode={statusCode}>
        <LessonPageTemplate
          lesson={lesson}
          course={course}
        />
      </SiteTemplate>
    );
  }
}

LessonPage.propTypes = {
  course: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  lesson: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  statusCode: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  isStoreRehydrated: PropTypes.bool.isRequired,
};

LessonPage.defaultProps = {
  course: {},
  lesson: {},
  statusCode: 200,
};

const mapStateToProps = store => {
  let state = {
    isStoreRehydrated: false,
  };

  if (typeof store._persist !== 'undefined') { // eslint-disable-line no-underscore-dangle
    state.isStoreRehydrated = store._persist.rehydrated; // eslint-disable-line no-underscore-dangle
  }

  return state;
};

export default withRedux(connect(mapStateToProps)(withAuth(LessonPage)));
