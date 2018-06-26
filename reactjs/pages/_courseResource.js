import React from 'react';
import PropTypes from 'prop-types';
import withAuth from '../auth/withAuth';
import SiteTemplate from '../components/organisms/Templates/SiteTemplate';
import withRedux from '../store/withRedux';
import CourseResouces from '../components/organisms/Templates/CourseResouces';
import * as dataProcessors from '../utils/dataProcessors';

class CourseResoucePage extends React.Component {
  static async getInitialProps({ request, query, res }) {
    const initialProps = {
      course: {},
      resources: [],
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

    try {
      // Fetch course resouce data from the backend.
      const response = await request
        .get(`/course/resources/${initialProps.course.id}`)
        .query({ '_format': 'json' });

      if (response.body) {
        initialProps.resources = response.body;
      }
    } catch (error) {
      console.log('Could not load course resources.', error);
      if (res) res.statusCode = 500;
      initialProps.statusCode = 500;
      return initialProps;
    }

    return initialProps;
  }

  render() {
    const { course, resources, statusCode } = this.props;
    return (
      <SiteTemplate className="lesson" statusCode={statusCode}>
        <CourseResouces
          course={course}
          resources={resources}
        />
      </SiteTemplate>
    );
  }
}

CourseResoucePage.propTypes = {
  course: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  resources: PropTypes.arrayOf(PropTypes.object),
  statusCode: PropTypes.number,
};

CourseResoucePage.defaultProps = {
  course: {},
  resources: [],
  statusCode: 200,
};

export default withRedux(withAuth(CourseResoucePage));
