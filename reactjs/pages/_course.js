import React from 'react';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import Header from '../components/organisms/Header';
import withRedux from '../store/withRedux';
import CoursePageTemplate from '../components/organisms/Templates/Course';
import * as dataProcessors from '../utils/dataProcessors';

class CoursePage extends React.Component {

  render() {

    const { course } = this.props;

    if (Object.keys(course).length === 0) {
      return <div>Page not found</div>;
    }

    return (
      <App>
        <Header />
        <div className="page-with-header">
          <CoursePageTemplate course={course} />
        </div>
      </App>
    );
  }

  static async getInitialProps({ request, query, res }) {

    const initialProps = {
      course: {},
    };

    // Get a course by path.
    let response;
    try {
      response = await request
        .get('/router/translate-path')
        .query({
          '_format': 'json',
          'path': query.course
        });

      const { entity } = response.body;
      // TODO: Test this case.
      if (entity.type !== 'node' || entity.bundle !== 'course') {
        throw new Error('The loading entity is not of the expected type.');
      }

      // TODO: Handle case when path alias was changed.

      const responseCourse = await request
        .get('/jsonapi/group_content/class-group_node-course')
        .query({
          // Include class group, course entity, course image.
          'include': 'gid,entity_id,entity_id.field_course_image,entity_id.field_course_lessons,entity_id.field_course_organisation,entity_id.field_course_instructors,entity_id.field_time_to_complete_minutes,entity_id.field_course_description',
          // Course entity fields.
          'fields[node--course]': 'title,nid,uuid,path,field_course_image,field_course_lessons,created,field_course_organisation,field_course_instructors,field_time_to_complete_minutes,field_course_description',
          // Lesson entity fields.
          'fields[node--lesson]': 'title,path,nid',
          // Course image fields.
          'fields[file--image]': 'url',
          // Class group fields.
          'fields[group--class]': 'uuid,label',
          // Organisation fields.
          'fields[taxonomy_term--organisations]': 'uuid,name',
          // User fields.
          'fields[user--user]': 'uuid,field_first_name,field_last_name',
          // Filter by nid.
          'filter[entity_id][value]': entity.id,
        });

      initialProps.course = dataProcessors.courseData(responseCourse.body.data[0]);
    } catch (error) {
      if (res) res.statusCode = 404;
      console.log(error);
    }

    return initialProps;
  }

}

export default withRedux(withAuth(CoursePage));
