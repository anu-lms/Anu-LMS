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
          'include': 'gid,entity_id,entity_id.field_course_image,entity_id.field_course_lessons',
          // Course entity fields.
          'fields[node--course]': 'title,nid,uuid,path,field_course_image,created,field_course_lessons',
          // Course image fields.
          'fields[file--image]': 'url',
          // Limit lessons fields.
          'fields[node--lesson]': 'nid,title,path',
          // Class group fields.
          'fields[group--class]': 'uuid,label',
          // Sort by created date.
          'sort': 'created'
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

      // Get currently logged in user.
      // @todo: consider to store user id in local storage after user login.
      const userResponse = await request.get('/user/me?_format=json');
      const currentUser = dataProcessors.userData(userResponse.body);

      // Fetch course progress entities available for this user.
      // @todo: will be improved to load real course progress from the backend.
      const responseRecentCourses = await request
        .get('/jsonapi/learner_progress/course')
        .query({
          // Include class group, course entity, course image.
          'include': 'field_course',
          'filter[uid][value]': currentUser.uid,
          'sort': '-changed'
        });

      // Leave only recent 3 available courses.
      initialProps.recentCoursesIds = responseRecentCourses.body.data
        .map((item, index) => item.fieldCourse.id !== undefined ? item.fieldCourse.id : null)
        .filter((item) => Object.keys(initialProps.coursesById).indexOf(item) !== -1)
        .slice(0, 3);
    }
    catch (error) {
      console.error('Could not fetch dashboard classes / courses.');
      console.error(error);
    }

    return initialProps;
  }
}

export default withRedux(withAuth(DashboardPage));
