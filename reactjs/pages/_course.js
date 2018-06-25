import React from 'react';
import PropTypes from 'prop-types';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import withSentry from '../application/withSentry';
import SiteTemplate from '../components/organisms/Templates/SiteTemplate';
import CoursePageTemplate from '../components/organisms/Templates/Course';
import * as dataProcessors from '../utils/dataProcessors';

class CoursePage extends React.Component {
  static async getInitialProps({ request, query, res }) {
    const initialProps = {
      course: {},
      statusCode: 200,
    };

    let response;

    try {
      // Get a course by path.
      response = await request
        .get('/router/translate-path')
        .query({
          '_format': 'json',
          'path': query.course,
        });

      const { entity } = response.body;

      // Make sure the node is of the right type.
      if (entity.type !== 'node' || entity.bundle !== 'course') {
        console.error('Could not find the course under with the given URL.');
        if (res) res.statusCode = 404;
        initialProps.statusCode = 404;
        return initialProps;
      }

      // TODO: Handle case when path alias was changed.
      // TODO: POTENTIAL TO REMOVE GROUP.
      const responseCourse = await request
        .get('/jsonapi/group_content/class-group_node-course')
        .query({
          // Include class group, course entity, course image.
          'include': 'gid,entity_id,entity_id.field_course_image,entity_id.field_course_lessons,entity_id.field_course_organisation,entity_id.field_course_instructors,entity_id.field_time_to_complete_minutes,entity_id.field_course_description',
          // Course entity fields.
          'fields[node--course]': 'title,nid,uuid,path,field_course_image,field_course_lessons,created,field_course_organisation,field_course_instructors,field_time_to_complete_minutes,field_course_description,field_course_has_resources',
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

      // 403 Errors from this response can't be catches with simple catch,
      // so we check response body for errors and throw an error.
      if (responseCourse.body.data.length === 0 && responseCourse.body.meta &&
        responseCourse.body.meta.errors && responseCourse.body.meta.errors[0].status) {
        initialProps.statusCode = responseCourse.body.meta.errors[0].status;
        throw Error(responseCourse.meta.errors[0].detail);
      }

      initialProps.course = dataProcessors.courseData(responseCourse.body.data[0]);
    } catch (error) {
      console.error('Could not load course.', error);
      initialProps.statusCode = initialProps.statusCode !== 200 ? initialProps.statusCode : 500;

      if (res) res.statusCode = initialProps.statusCode;
      return initialProps;
    }

    try {
      // Fetch data regarding the course progress from the backend.
      response = await request
        .get(`/learner/progress/${initialProps.course.id}`)
        .query({ '_format': 'json' });

      const progress = response.body;

      // Add information about the course progress to the course object
      initialProps.course.progress = Math.round(progress.course);

      // Add information about the lessons progress to the appropriate objects.
      Object.entries(progress.lessons).forEach(([id, lessonProgress]) => {
        const lessonId = parseInt(id); // eslint-disable-line radix
        const index = initialProps.course.lessons.findIndex(lesson => lesson.id === lessonId);
        if (index !== -1) {
          initialProps.course.lessons[index].progress = Math.round(lessonProgress);
        }
      });

      // Add url of the lesson which was accessed last to the course object.
      if (progress.recentLesson && progress.recentLesson.url) {
        const courseUrl = initialProps.course.url;
        const lessonSlug = progress.recentLesson.url;
        initialProps.course.recentLessonUrl = courseUrl + lessonSlug;
      }
    } catch (error) {
      // Log error but still render the page, because this issue is not a
      // deal breaker to display course content.
      console.error('Could not fetch course progress.', error);
    }

    return initialProps;
  }

  render() {
    const { course, statusCode } = this.props;
    return (
      <SiteTemplate statusCode={statusCode}>
        <CoursePageTemplate course={course} />
      </SiteTemplate>
    );
  }
}

CoursePage.propTypes = {
  course: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  statusCode: PropTypes.number,
};

CoursePage.defaultProps = {
  course: {},
  statusCode: 200,
};

export default withSentry(withRedux(withAuth(CoursePage)));
