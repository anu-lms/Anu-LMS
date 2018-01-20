import React, { Component } from 'react';
import request from "../utils/request";
import * as dataProcessors from "../utils/dataProcessors";
import App from '../application/App';
import withAuth from '../auth/withAuth';
import StudentDashboard from '../components/organisms/StudentDashboard';
import Header from '../components/organisms/Header';

class DashboardPage extends Component {

  static async getInitialProps({ accessToken }) {

    const initialProps = {
      classes: [],
      coursesById: {},
      recentCoursesIds: [],
      coursesInClassesIds: {}
    };

    try {
      // Fetch all classes available for this user.
      const responseAllClasses = await request
        // TODO: how to move this header into ../utils/request?
        .set('Authorization', `Bearer ${accessToken}`)
        .get('/jsonapi/group/class')
        .query({
          'fields[group--class]': 'uuid,label',
          'sort': 'created'
        });

      // Fetch all courses available for this user.
      const responseAllCourses = await request
        .set('Authorization', `Bearer ${accessToken}`)
        .get('/jsonapi/group_content/class-group_node-course')
        .query({
          // Include class group, course entity, course image.
          'include': 'gid,entity_id,entity_id.field_course_image',
          // Course entity fields.
          'fields[node--course]': 'title,uuid,field_course_image,created',
          // Course image fields.
          'fields[file--image]': 'url',
          // Class group fields.
          'fields[group--class]': 'uuid,label',
          // Sort coused by class gid first to simplify grouping.
          'sort': 'gid,created'
        });

      // Fetch three recent courses.
      const responseRecentCourses = await request
        .set('Authorization', `Bearer ${accessToken}`)
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

      initialProps.recentCoursesIds = responseRecentCourses.body.data.map(courseData => courseData.entityId.uuid);

    }
    catch (error) {
      console.error('Could not fetch recent courses.');
      console.error(error);
    }

    return initialProps;
  }

  render() {

    return (
      <App>
        <div className="container-fluid page-container">
          <Header />
          <StudentDashboard {...this.props} />
          <footer><p>Copyright 2018 Anu © All Rights Reserved</p></footer>
        </div>
      </App>
    );
  }
}

export default withAuth(DashboardPage);
