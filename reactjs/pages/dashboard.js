import React, { Component } from 'react';
import PropTypes, { func } from 'prop-types';
import request from "../utils/request";
import * as dataProcessors from "../utils/dataProcessors";
import App from '../application/App';
import withAuth from '../auth/withAuth';
import StudentDashboard from '../components/organisms/StudentDashboard';
import Button from '../components/atoms/Button';
import Separator from '../components/atoms/Separator';

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
          <header>
            <div className="col-auto mr-auto header__logo"><a className="header__icon-home">L</a></div>
            <div className="col-auto header__toolbar">
              <a href="#" className="header__icon-search">S</a>
              <div className="header__search"><input type="text" className="header__search-input" /></div>
              <a href="#" className="header__icon-notifications">N</a>
              <a href="#" className="header__profile"><img className="header__profile-avatar" src="https://gravatar.com/avatar/e0bcb315f3745d5cc747daa3c4c05c9a.png?s=128&d=https%3A%2F%2Fd3vv6lp55qjaqc.cloudfront.net%2Fitems%2F2t0t432s021o0s2V252v%2FImage%25202016-10-22%2520at%252012.15.41%2520AM.jpg%3Fv%3D8d32303c" /></a>
            </div>
          </header>
          <StudentDashboard {...this.props} />
          <footer><p>Copyright 2018 Anu © All Rights Reserved</p></footer>
        </div>
      </App>
    );
  }
}

export default withAuth(DashboardPage);
