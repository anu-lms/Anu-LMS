import React from 'react';
import PropTypes from 'prop-types';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import withSentry from '../application/withSentry';
import SiteTemplate from '../components/organisms/Templates/SiteTemplate';
import CoursePageTemplate from '../components/organisms/Templates/Course';
import * as dataProcessors from '../utils/dataProcessors';

class CoursePage extends React.Component {
  static async getInitialProps({ request, query, res }) {
    const initialProps = {
      course: {},
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
        console.error(courseResponse.body);
        initialProps.statusCode = courseResponse.status;
        if (res) res.statusCode = courseResponse.status;
        return initialProps;
      }

      // Keep course data.
      initialProps.course = dataProcessors.courseData(courseResponse.body);
    } catch (error) {
      console.error('Could not load course.', error);
      initialProps.statusCode = initialProps.statusCode !== 200 ? initialProps.statusCode : 500;
      if (res) res.statusCode = initialProps.statusCode;
      return initialProps;
    }

    return initialProps;
  }

  render() {
    const { course, statusCode } = this.props;
    return (
      <SiteTemplate statusCode={statusCode}>
        <CoursePageTemplate course={course} />
      </SiteTemplate>
    );
  }
}

CoursePage.propTypes = {
  course: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  statusCode: PropTypes.number,
};

CoursePage.defaultProps = {
  course: {},
  statusCode: 200,
};

export default withSentry(withRedux(withAuth(CoursePage)));
