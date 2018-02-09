import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import LinkWithProgress from '../../../atoms/Link/LinkWithProgress';
import { Link } from '../../../../routes';
import { plural } from '../../../../utils/string';
import * as lessonHelper from "../../../../helpers/lesson";
import {getLessonToResume, getProgress} from '../../../../helpers/course';

const ResumeButton = ({ lessonToResume, courseLessons, progressPercent }) => (
  <Fragment>

    {lessonToResume !== false &&
    <Link to={lessonToResume.url}>
      <a className="btn btn-primary btn-lg btn-block">
        Resume
      </a>
    </Link>
    }

    {lessonToResume === false && courseLessons.length > 0 && progressPercent < 100 &&
    <Link to={courseLessons[0].url}>
      <a className="btn btn-primary btn-lg btn-block">
        Start
      </a>
    </Link>
    }

  </Fragment>
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

  if (progressPercent === 100) {
    return (<p className="estimated-time">You've completed this course.</p>);
  }

  const remainingMinutes = Math.ceil(totalMinutes * (100 - progressPercent) * 0.01);
  if (remainingMinutes === 0) {
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

const CoursePageTemplate = ({ course, lessons, lessonToResume, progressPercent }) => (
  <div className="container container-course pt-3 pt-md-5">
    <div className="row">

      <div className="col-md-6 course-header">
        <h4>{course.title}</h4>
        <p className="organisation">GiANT Worldwide</p>
        <Instructors instructors={course.instructors} />

        <TimeToComplete
          progressPercent={progressPercent}
          totalMinutes={course.totalMinutes}
        />

        <ResumeButton
          progressPercent={progressPercent}
          lessonToResume={lessonToResume}
          courseLessons={course.lessons}
        />

      </div>

      <div className="col-md-6 course-cover">

        <div className="cover-image">
          <img className="course-image" src={course.imageUrl} />
          <div className="progress-bar">
            <div className="current-progress" style={{ width: progressPercent + '%' }} />
          </div>
        </div>

        <div className="completion">{progressPercent}% complete</div>

        <ResumeButton
          progressPercent={progressPercent}
          lessonToResume={lessonToResume}
          courseLessons={course.lessons}
        />

      </div>

      {course.lessons.length > 0 &&
      <div className="col-md-6 course-lessons">
        <h5>Course Content</h5>
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
      }

      {course.description &&
      <div className="col-md-6 course-overview">
        <h5>Overview</h5>
        <div dangerouslySetInnerHTML={{ __html: course.description }} />
      </div>
      }
    </div>
  </div>
);

const mapStateToProps = (store, { course }) => ({
  lessons: store.lesson,
  lessonToResume: getLessonToResume(store.lesson, course.lessons),
  progressPercent: getProgress(store.course, course.id)
});

export default connect(mapStateToProps)(CoursePageTemplate);
