import React from 'react';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import Header from '../components/organisms/Header';
import * as dataProcessors from '../utils/dataProcessors';
import LessonPageTemplate from '../components/organisms/Templates/Lesson';
import ErrorPage from '../components/atoms/ErrorPage';

class LessonPage extends React.Component {

  render () {
    const { statusCode } = this.props;
    return (
      <App>
        <Header />
        <div className="page-with-header lesson">
          {statusCode === 200 &&
          <LessonPageTemplate
            lesson={this.props.lesson}
            course={this.props.course}
          />
          }
          {statusCode !== 200 &&
          <ErrorPage code={statusCode} />
          }
          </div>
      </App>
    );
  }

  static async getInitialProps({ request, query, res }) {

    const initialProps = {
      course: {},
      lesson: {},
      statusCode: 200,
    };

    // TODO: Handle case when path alias was changed.

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
          'fields[node--course]': 'title,path,nid,uuid,field_course_image,field_course_lessons,created',
          // Lesson entity fields.
          'fields[node--lesson]': 'title,path,nid',
          // Course image fields.
          'fields[file--image]': 'url',
          // Class group fields.
          'fields[group--class]': 'uuid,label',
          // Filter by nid.
          'filter[entity_id][value]': entity.id,
        });

      initialProps.course = dataProcessors.courseData(responseCourse.body.data[0]);

    } catch (error) {
      console.log('Could not load course. Error:');
      console.log(error);
      if (res) res.statusCode = 500;
      initialProps.statusCode = 500;
      return initialProps;
    }

    // Get a lesson by path.
    // TODO: check if course is parent of lesson.
    try {
      response = await request
        .get('/router/translate-path')
        .query({
          '_format': 'json',
          'path': query.lesson
        });

      const { entity } = response.body;

      // Make sure the lesson was found.
      if (entity.type !== 'node' || entity.bundle !== 'lesson') {
        console.log('Could not find the lesson under with the given URL.');
        if (res) res.statusCode = 404;
        initialProps.statusCode = 404;
        return initialProps;
      }

      const responseLesson = await request
        .get('/jsonapi/group_content/class-group_node-lesson')
        .query({
          // Include referenced fields.
          'include': '' +
          'entity_id,' +
          'entity_id.field_lesson_course,' +
          'entity_id.field_lesson_blocks,' +
          'entity_id.field_lesson_blocks.field_paragraph_image,' +
          'entity_id.field_lesson_blocks.field_paragraph_file,' +
          'entity_id.field_lesson_blocks.field_paragraph_private_file,' +
          'entity_id.field_lesson_blocks.field_quiz_blocks,' +
          'entity_id.field_lesson_blocks.field_quiz_blocks.field_paragraph_image,' +
          'entity_id.field_lesson_blocks.field_quiz_blocks.field_paragraph_file',
          // Lesson entity fields.
          'fields[node--lesson]': 'title,path,nid,uuid,field_lesson_course,field_lesson_blocks,field_is_assessment',
          // Course entity fields.
          'fields[node--course]': 'path,nid',
          // Filter by nid.
          'filter[entity_id][value]': entity.id,
        });

      initialProps.lesson = dataProcessors.lessonData(responseLesson.body.data[0]);

    } catch (error) {
      console.log('Could not load lesson. Error:');
      console.log(error);
      if (res) res.statusCode = 500;
      initialProps.statusCode = 500;
      return initialProps;
    }

    try {

      // Fetch data regarding the course progress from the backend.
      response = await request
        .get('/learner/progress/' + initialProps.course.id)
        .query({ '_format': 'json' });

      const progress = response.body;

      // Add information about the course progress to the course object.
      initialProps.course.progress = Math.round(progress.course);

      // Add information about the lessons progress to the appropriate objects.
      Object.entries(progress.lessons).forEach(([id, progress]) => {
        const lessonId = parseInt(id);
        const index = initialProps.course.lessons.findIndex(lesson => lesson.id === lessonId);
        if (index !== -1) {
          initialProps.course.lessons[index].progress = Math.round(progress);
        }

        // Add lesson progress to the currently viewing lesson.
        if (parseInt(id) === initialProps.lesson.id) {
          initialProps.lesson.progress = Math.round(progress);
        }
      });

    } catch (error) {
      // Log error but still render the page, because this issue is not a
      // deal breaker to display course content.
      console.log('Could not fetch course progress. Error:');
      console.log(error);
    }

    return initialProps;
  }

}

export default withRedux(withAuth(LessonPage));
