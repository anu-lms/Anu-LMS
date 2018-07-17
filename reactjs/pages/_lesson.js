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
      let response = await request
        .get('/lesson')
        .query({
          '_format': 'json',
          'path': `/${query.lesson}`,
        })
      // Tell superagent to consider all requests with Drupal responses as
      // successful. Later we capture error codes if any.
        .ok(resp => resp.body && resp.status);

      // Handle any non-OK response from the backend.
      if (response.status !== 200) {
        console.log(response.body);
        initialProps.statusCode = response.status;
        if (res) res.statusCode = response.status;
        return initialProps;
      }

      // Make sure the current course's url matches the slug from the url.
      if (response.body.course.url !== `/${query.course}`) {
        console.log('Course URL from the browser and from the lesson do not match.');
        initialProps.statusCode = 404;
        if (res) res.statusCode = 404;
        return initialProps;
      }

      // Process lesson's and lesson's course's data.
      initialProps.lesson = response.body;
      initialProps.course = dataProcessors.courseData(response.body.course);
    } catch (error) {
      console.log('Could not load lesson.');
      console.log(error);
      initialProps.statusCode = initialProps.statusCode !== 200 ? initialProps.statusCode : 500;
      if (res) res.statusCode = initialProps.statusCode;
      return initialProps;
    }

    return initialProps;
  }

  componentDidMount() {
    // const { socket } = this.props;
    // // Listen for a new notification to arrive from socket.
    // socket.on('comment', comment => {
    //   console.log(comment);
    // });

    console.log('componentDidMount', this.props);

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
