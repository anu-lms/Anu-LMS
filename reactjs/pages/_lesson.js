import React from 'react';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import Header from '../components/organisms/Header';
import withRedux from '../store/withRedux';
import LessonPageTemplate from '../components/organisms/Templates/Lesson';
import * as dataProcessors from "../utils/dataProcessors";

class LessonPage extends React.Component {

  render () {
    return (
      <App>
        <Header />
        <div className="page-with-header lesson">
          <LessonPageTemplate
            toc={this.props.course.lessons}
            lesson={this.props.lesson}
            course={this.props.course}
          />
        </div>
      </App>
    );
  }

  static async getInitialProps({ request, query, res }) {

    const initialProps = {
      course: {},
      lesson: {},
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
      // TODO: Test this case.
      if (entity.type !== 'node' || entity.bundle !== 'course') {
        throw new Error('The loading course entity is not of the expected type.');
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
      if (res) res.statusCode = 404;
      console.log(error);
      return initialProps;
    }

    // Get a lesson by path.
    try {
      response = await request
        .get('/router/translate-path')
        .query({
          '_format': 'json',
          'path': query.lesson
        });

      const { entity } = response.body;
      // TODO: Test this case.
      if (entity.type !== 'node' || entity.bundle !== 'lesson') {
        throw new Error('The loading lesson entity is not of the expected type.');
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
      console.log(error);
      if (res) res.statusCode = 404;
      return initialProps;
    }

    // TODO: check if course is parent of lesson.

    return initialProps;
  }

}

export default withRedux(withAuth(LessonPage));
