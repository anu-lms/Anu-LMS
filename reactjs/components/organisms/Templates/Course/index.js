import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import LinkWithProgress from '../../../atoms/Link/LinkWithProgress';
import { Link } from '../../../../routes';
import { plural } from '../../../../utils/string';
import * as lessonHelper from "../../../../helpers/lesson";
import { getProgress } from '../../../../helpers/course';

const ResumeButton = ({ url, progressPercent }) => (
  <Link to={url}>
    <a className="btn btn-primary btn-lg btn-block">
      {progressPercent == 0 && 'Start'}
      {progressPercent > 0 && 'Resume'}
    </a>
  </Link>
);

const Instructors = ({ instructors }) => (
  <p className="instructors">
    {plural(instructors.length, 'Instructor', 'Instructors')}:{' '}
    <span>{
      instructors
        .map(instructor => instructor.realname).join(', ')
    }</span>
  </p>
);

const TimeToComplete = ({ totalMinutes, progressPercent }) => {
  if (!totalMinutes) {
    return null;
  }

  const remainingMinutes = Math.ceil(totalMinutes * (100 - progressPercent) * 0.01);
  if (remainingMinutes == 0) {
    return null;
  }
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(hours + ' ' + plural(hours, 'hour', 'hours'));
  }
  if (minutes > 0) {
    parts.push(minutes + ' ' + plural(minutes, 'minute', 'minutes'));
  }

  return (
    <p className="estimated-time">
      {parts.join(' and ')} remaining
    </p>
  );
};

const CoursePageTemplate = ({ course, lessons, progressPercent }) => (
  <div className="container container-course">
    <div className="row">
      <div className="col-md-6 course-header">
        <h1>{course.title}</h1>
        <p className="organisation">GiANT Worldwide</p>
        <Instructors instructors={course.instructors} />
        <TimeToComplete progressPercent={progressPercent} totalMinutes={course.totalMinutes} />
        <ResumeButton progressPercent={progressPercent} url={course.url} />
      </div>
      <div className="col-md-6 course-cover">
        <img className="course-image" src={course.imageUrl} />
        <div className="progress-bar">
          <div className="current-progress" style={{ width: progressPercent + '%' }} />
        </div>
        <div className="completion">{progressPercent}% complete</div>
        <ResumeButton progressPercent={progressPercent} url={course.url} />
      </div>
      <div className="col-md-6 course-lessons">
        <h3>Course Content</h3>
        <div className="lessons-list">
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
      <div className="col-md-6 course-overview">
        <h3>Overview</h3>
        <p>How to be present and productive when there is never enough time.</p>
      </div>
    </div>
  </div>
);

const mapStateToProps = (store, { course }) => ({
  lessons: store.lesson,
  progressPercent: getProgress(store.course, course.id)
});

export default connect(mapStateToProps)(CoursePageTemplate);
