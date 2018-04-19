import React from 'react';
import PropTypes from 'prop-types';
import * as dataProcessors from '../utils/dataProcessors';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import Dashboard from '../components/organisms/Templates/Dashboard';
import Header from '../components/organisms/Header';
import ErrorPage from '../components/atoms/ErrorPage';

class DashboardPage extends React.Component {
  static async getInitialProps({ request, res }) {
    const initialProps = {
      classes: [],
      recentCourses: [],
      statusCode: 200,
    };

    try {
      // Make backend request to fetch list of classes and related courses.
      const response = await request
        .get('/classes/courses?_format=json')
        .catch(error => {
          initialProps.statusCode = error.response.status;
          throw Error(error.response.body.message);
        });

      // If the response is successfull it will return an array with classes
      // containing related courses.
      if (response.body && response.body.length > 0) {
        response.body.forEach(data => {
          // Define class item object with id / label.
          let classItem = {};
          classItem.id = data.group_id ? parseInt(data.group_id, 10) : 0;
          classItem.label = data.group_name || '';

          classItem.courses = [];
          if (data.courses) {
            data.courses.forEach(course => {
              // Convert every course object from the backend into an item
              // suitable for frontend work.
              const processedCourse = dataProcessors.courseDataFromREST(course);

              // Add the course to the list of all class courses.
              classItem.courses.push(processedCourse);

              // Add to the list of recent courses all courses which were
              // ever accessed by the current user.
              if (processedCourse.recentAccess) {
                const index = initialProps.recentCourses.findIndex(courseItem =>
                  courseItem.id === processedCourse.id);
                if (index === -1) {
                  initialProps.recentCourses.push(processedCourse);
                }
              }
            });
          }

          // Gather list of classes disregard of classes inside of them.
          initialProps.classes.push(classItem);
        });

        // If the current user has accessed any courses - we want to display
        // only 3 recently accessed.
        if (initialProps.recentCourses.length > 0) {
          initialProps.recentCourses = initialProps.recentCourses
            .sort((a, b) => {
              if (a.recentAccess < b.recentAccess) return 1;
              if (a.recentAccess > b.recentAccess) return -1;
              return 0;
            })
            .slice(0, 3);
        }
      }
    }
    catch (error) {
      console.error('Could not fetch dashboard classes and courses.', error);
      initialProps.statusCode = initialProps.statusCode !== 200 ? initialProps.statusCode : 500;

      if (res) res.statusCode = initialProps.statusCode;
    }

    return initialProps;
  }

  render() {
    const { statusCode } = this.props;
    return (
      <App>
        <Header />
        <div className="page-with-header">
          {statusCode === 200 ? (
            <Dashboard {...this.props} />
          ) : (
            <ErrorPage code={statusCode} />
          )}
        </div>
      </App>
    );
  }
}

DashboardPage.propTypes = {
  statusCode: PropTypes.number,
};

DashboardPage.defaultProps = {
  statusCode: 200,
};

export default withRedux(withAuth(DashboardPage));
