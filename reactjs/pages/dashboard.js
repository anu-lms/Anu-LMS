import React, { Component } from 'react';
import * as dataProcessors from '../utils/dataProcessors';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import Dashboard from '../components/organisms/Templates/Dashboard';
import Header from '../components/organisms/Header';
import * as lessonHelpers from '../helpers/lesson';

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
      courses: [],
      classes: [],
      recentCourses: [],
    };

    try {

      // Get currently logged in user.
      // @todo: consider to store user id in local storage after user login.
      // TODO: EXPIRE ALL TOKENS ON THE BACKEND!
      //const userResponse = await request.get('/user/me?_format=json');
      //const currentUser = dataProcessors.userData(userResponse.body);

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

      //console.log(responseAllCourses);

      responseAllCourses.body.data.forEach(courseData => {
        const course = dataProcessors.courseData(courseData);
        initialProps.courses.push(course);

        // TODO: Sort alphabetically.
        const index = initialProps.classes.findIndex(item => item.id === course.groupId);
        if (index === -1) {
          initialProps.classes.push({ id: course.groupId, label: course.groupLabel });
        }
      });

      // Fetch course progress available for this user.
      // TODO: Potential to run request in parallel with previous.
      // TODO: SORT BY RECENTLY ACCESSED LESSONS.
      const responseProgress = await request
        .get('/learner/progress?_format=json');

      // Leave only recent 3 available courses.
      responseProgress.body.forEach(courseProgress => {
        const courseId = parseInt(courseProgress.courseId);
        const index = initialProps.courses.findIndex(course => course.id === courseId);

        // TODO: TEST LIMIT / SORT.
        if (index !== -1) {
          initialProps.courses[index].progress = courseProgress.progress;

          if (courseProgress.recentLesson && courseProgress.recentLesson.url) {
            const courseUrl = initialProps.courses[index].url;
            const lessonSlug = courseProgress.recentLesson.url;
            initialProps.courses[index].recentLessonUrl = `${courseUrl}${lessonSlug}`;
          }

          if(initialProps.recentCourses.length < 3) {
            initialProps.recentCourses.push(initialProps.courses[index]);
          }
        }

      });
    }
    catch (error) {
      console.error('Could not fetch dashboard classes / courses.');
      console.error(error);

      // TODO: Better error handling for server + client.
    }

    console.log('initialProps');
    console.log(initialProps);

    return initialProps;
  }
}

export default withRedux(withAuth(DashboardPage));
