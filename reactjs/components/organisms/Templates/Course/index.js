import React from 'react';
import { connect } from 'react-redux';
import LinkWithProgress from '../../../atoms/Link/LinkWithProgress';
import * as lessonHelper from "../../../../helpers/lesson";

const CoursePageTemplate = ({ course, lessons }) => (
  <div className="container">
    <div className="row">
      <div className="col-12">
        {course.title}
      </div>
      <div className="col-12">
        {course.lessons.map(lesson => (
          <LinkWithProgress
            key={lesson.id}
            title={lesson.title}
            url={lesson.url}
            progress={lessonHelper.getProgress(lessons, lesson.id)}
          />
        ))}
      </div>
    </div>
  </div>
);

const mapStateToProps = ({ lesson }) => ({
  lessons: lesson,
});

export default connect(mapStateToProps)(CoursePageTemplate);
