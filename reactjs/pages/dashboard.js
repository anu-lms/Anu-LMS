import React from 'react';
import PropTypes from 'prop-types';
import * as dataProcessors from '../utils/dataProcessors';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import Dashboard from '../components/organisms/Templates/Dashboard';
import Header from '../components/organisms/Header';
import ErrorPage from '../components/atoms/ErrorPage';
import * as classHelpers from '../helpers/class';

class DashboardPage extends React.Component {
  static async getInitialProps({ request, res }) {
    const initialProps = {
      courses: [],
      classes: [],
      recentCourses: [],
      statusCode: 200,
    };

    try {
      // Fetch all courses available for this user.
      const responseAllCourses = await request
        .get('/jsonapi/group_content/class-group_node-course')
        .query({
          // Include class group, course entity, course image.
          'include': 'gid,entity_id,entity_id.field_course_image',
          // Course entity fields.
          'fields[node--course]': 'nid,title,path,created,field_course_image',
          // Course image fields.
          'fields[file--image]': 'url',
          // Class group fields.
          'fields[group--class]': 'id,label',
          // Sort by created date.
          'sort': 'created',
          // TODO: ADD FILTER BY ACCESSIBLE CLASSES FOR THIS USER.
        });

      // Gather list of courses available for the current user.
      responseAllCourses.body.data.forEach((courseData) => {
        const course = dataProcessors.courseData(courseData);
        initialProps.courses.push(course);
      });

      // Get list of classes from metadata of courses.
      initialProps.classes = classHelpers.getClassesFromCourses(initialProps.courses);
    }
    catch (error) {
      console.error('Could not fetch dashboard courses. Error:');
      console.error(error);
      if (res) res.statusCode = 500;
      initialProps.statusCode = 500;
      return initialProps;
    }

    try {
      // Fetch all courses progress available for this user.
      // TODO: Run request in parallel with previous.
      const responseProgress = await request
        .get('/learner/progress?_format=json');

      // Make sure the response body is not null.
      if (responseProgress.body) {
        // Attach course progresses to their corresponsing entities.
        responseProgress.body.forEach((courseProgress) => {
          // Find course to which the progress data should be added.
          const courseId = parseInt(courseProgress.courseId); // eslint-disable-line radix
          const index = initialProps.courses.findIndex(course => course.id === courseId);

          // If corresponsing course is found - add information about the
          // progress and the lesson which was accessed the last.
          if (index !== -1) {
            initialProps.courses[index].progress = courseProgress.progress;

            // Add information regarding the lesson which was accessed the last.
            if (courseProgress.recentLesson && courseProgress.recentLesson.url) {
              const courseUrl = initialProps.courses[index].url;
              const lessonSlug = courseProgress.recentLesson.url;
              initialProps.courses[index].recentLessonUrl = `${courseUrl}${lessonSlug}`;
            }

            // Simply push 3 first courses to the recent courses list.
            // Learner progress items are sorted by recently accessed courses, so
            // it works as expected here.
            if (initialProps.recentCourses.length < 3) {
              initialProps.recentCourses.push(initialProps.courses[index]);
            }
          }
        });
      }
    } catch (error) {
      // Log error but still render the page, because this issue is not a
      // deal breaker to display courses / classes.
      console.error('Could not fetch learner progress. Error:');
      console.error(error);
    }

    return initialProps;
  }

  render() {
    const { statusCode } = this.props;
    return (
      <App>
        <Header />
        <div className="page-with-header">
          {statusCode === 200 &&
          <Dashboard {...this.props} />
          }
          {statusCode !== 200 &&
          <ErrorPage code={statusCode} />
          }
        </div>
      </App>
    );
  }
}

DashboardPage.propTypes = {
  statusCode: PropTypes.number,
};

export default withRedux(withAuth(DashboardPage));
