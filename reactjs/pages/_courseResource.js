import React from 'react';
import PropTypes from 'prop-types';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import withSentry from '../application/withSentry';
import SiteTemplate from '../components/organisms/Templates/SiteTemplate';
import CourseResouces from '../components/organisms/Templates/CourseResouces';
import * as dataProcessors from '../utils/dataProcessors';

class CourseResoucePage extends React.Component {
  static async getInitialProps({ request, query, res }) {
    const initialProps = {
      course: {},
      resources: [],
      statusCode: 200,
    };

    // Get a course by path.
    let response;
    try {
      response = await request
        .get('/router/translate-path')
        .query({
          '_format': 'json',
          'path': query.course,
        });

      const { entity } = response.body;

      // Make sure course was found.
      if (entity.type !== 'node' || entity.bundle !== 'course') {
        console.log('Could not find the course under with the given URL.');
        if (res) res.statusCode = 404;
        initialProps.statusCode = 404;
        return initialProps;
      }

      const responseCourse = await request
        .get('/jsonapi/group_content/class-group_node-course')
        .query({
          // Include class group, course entity, course image.
          'include': 'gid,entity_id,entity_id.field_course_image,entity_id.field_course_lessons',
          // Course entity fields.
          'fields[node--course]': 'title,path,nid,uuid,field_course_image,field_course_lessons,field_course_has_resources,created',
          // Lesson entity fields.
          'fields[node--lesson]': 'title,path,nid',
          // Course image fields.
          'fields[file--image]': 'url',
          // Class group fields.
          'fields[group--class]': 'uuid,label',
          // Filter by nid.
          'filter[entity_id][value]': entity.id,
        });

      // 403 Errors from this response can't be catches with simple catch,
      // so we check response body for errors and throw an error.
      if (responseCourse.body.data.length === 0 && responseCourse.body.meta &&
        responseCourse.body.meta.errors && responseCourse.body.meta.errors[0].status) {
        initialProps.statusCode = responseCourse.body.meta.errors[0].status;
        throw Error(responseCourse.meta.errors[0].detail);
      }

      initialProps.course = dataProcessors.courseData(responseCourse.body.data[0]);
    } catch (error) {
      console.log('Could not load course.', error);
      initialProps.statusCode = initialProps.statusCode !== 200 ? initialProps.statusCode : 500;

      if (res) res.statusCode = initialProps.statusCode;
      return initialProps;
    }

    try {
      // Fetch data regarding the course progress from the backend.
      response = await request
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

    try {
      // Fetch data regarding the course progress from the backend.
      response = await request
        .get(`/learner/progress/${initialProps.course.id}`)
        .query({ '_format': 'json' });

      const progress = response.body;

      // Add information about the course progress to the course object.
      initialProps.course.progress = Math.round(progress.course);

      // Add information about the lessons progress to the appropriate objects.
      Object.entries(progress.lessons).forEach(([id, lessonProgress]) => {
        const lessonId = parseInt(id); // eslint-disable-line radix
        const index = initialProps.course.lessons.findIndex(lesson => lesson.id === lessonId);
        if (index !== -1) {
          initialProps.course.lessons[index].progress = Math.round(lessonProgress);
        }
      });
    } catch (error) {
      // Log error but still render the page, because this issue is not a
      // deal breaker to display course content.
      console.log('Could not fetch course progress.', error);
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

export default withSentry(withRedux(withAuth(CourseResoucePage)));
