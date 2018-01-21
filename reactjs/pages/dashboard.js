import React, { Component } from 'react';
import * as dataProcessors from '../utils/dataProcessors';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import Dashboard from '../components/organisms/Templates/Dashboard';
import Header from '../components/organisms/Header';

class DashboardPage extends Component {

  render() {
    return (
      <App>
        <Header />
        <div className="page-with-header">
          <Dashboard {...this.props} />
        </div>
      </App>
    );
  }

  static async getInitialProps({ request }) {

    const initialProps = {
      classes: [],
      coursesById: {},
      recentCoursesIds: [],
      coursesInClassesIds: {}
    };

    try {
      // Fetch all classes available for this user.
      const responseAllClasses = await request
        .get('/jsonapi/group/class')
        .query({
          'fields[group--class]': 'uuid,label',
          'sort': 'created'
        });

      // Fetch all courses available for this user.
      const responseAllCourses = await request
        .get('/jsonapi/group_content/class-group_node-course')
        .query({
          // Include class group, course entity, course image.
          'include': 'gid,entity_id,entity_id.field_course_image',
          // Course entity fields.
          'fields[node--course]': 'title,uuid,path,field_course_image,created',
          // Course image fields.
          'fields[file--image]': 'url',
          // Class group fields.
          'fields[group--class]': 'uuid,label',
          // Sort coused by class gid first to simplify grouping.
          'sort': 'gid,created'
        });

      // Fetch three recent courses.
      const responseRecentCourses = await request
        .get('/jsonapi/group_content/class-group_node-course')
        .query({
          'include': 'entity_id',
          'fields[node--course]': 'uuid',
          'sort': '-created',
          'page[limit]': 3
        });

      initialProps.classes = responseAllClasses.body.data.map(classData =>
        dataProcessors.classData(classData)
      );

      initialProps.classes.forEach(classItem => {
        initialProps.coursesInClassesIds[classItem.uuid] = [];
      });

      responseAllCourses.body.data.forEach(courseData => {
        const course = dataProcessors.courseData(courseData);
        initialProps.coursesById[course.uuid] = course;
        initialProps.coursesInClassesIds[course.gid].push(course.uuid);
      });

      initialProps.recentCoursesIds = responseRecentCourses.body.data.map(
        courseData => courseData.entityId.uuid
      );
    }
    catch (error) {
      console.error('Could not fetch recent courses.');
      console.error(error);
    }

    return initialProps;
  }
}

export default withRedux(withAuth(DashboardPage));
