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

    try {
      let courseResponse = await request
      .get('/course/progress')
      .query({
        '_format': 'json',
        'path': `/${query.course}`,
      })
      // Tell superagent to consider all requests with Drupal responses as
      // successful. Later we capture error codes if any.
      .ok(response => response.body && response.status);

      // Handle any non-OK response from the backend.
      if (courseResponse.status !== 200) {
        console.log(courseResponse.body);
        initialProps.statusCode = courseResponse.status;
        if (res) res.statusCode = courseResponse.status;
        return initialProps;
      }

      // Keep course data.
      initialProps.course = dataProcessors.courseData(courseResponse.body);
    } catch (error) {
      console.log('Could not load course.');
      console.log(error);
      initialProps.statusCode = initialProps.statusCode !== 200 ? initialProps.statusCode : 500;
      if (res) res.statusCode = initialProps.statusCode;
      return initialProps;
    }

    // TODO: check if course is parent of lesson.
    try {
      const responseLesson = await request
        .get('/jsonapi/node/lesson')
        .query({
          // Include referenced fields.
          'include': '' +
          'field_lesson_course,' +
          'field_lesson_blocks,' +
          'field_lesson_blocks.field_paragraph_image,' +
          'field_lesson_blocks.field_paragraph_file,' +
          'field_lesson_blocks.field_paragraph_private_file,' +
          'field_lesson_blocks.field_quiz_blocks,' +
          'field_lesson_blocks.field_quiz_blocks.field_paragraph_image,' +
          'field_lesson_blocks.field_quiz_blocks.field_paragraph_file',
          // Lesson entity fields.
          'fields[node--lesson]': 'title,path,nid,uuid,field_lesson_course,field_lesson_blocks,field_is_assessment',
          // Course entity fields.
          'fields[node--course]': 'path,nid',
          // Filter by path.
          'filter[field_path][value]': '/' + query.lesson,
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
        throw Error(`Lesson not found`);
      }

      initialProps.lesson = dataProcessors.lessonData(responseLesson.body.data[0]);
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

    // TODO.
    //initialProps.lesson.progress = Math.round(lessonProgress);

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
        Alert.error("Referenced in url comment doesn't exist");
        console.error("Referenced paragraph doesn't exist", `Lesson: ${lesson.id}`, `Paragraph: ${paragraphId}`);
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
