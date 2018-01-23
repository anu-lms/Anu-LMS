import React from 'react';
import { connect } from 'react-redux';
import LinkWithProgress from '../../../atoms/Link/LinkWithProgress';
import { Link } from '../../../../routes';
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

const CoursePageTemplate = ({ course, lessons, progressPercent }) => (
  <div className="container container-course">
    <div className="row">
      <div className="col-md-6 course-header">
        <h1>{course.title}</h1>
        <p class="organisation">GiANT Worldwide</p>
        <p class="instructors">Instructor: <span>Case Keenum</span></p>
        <p className="estimated-time">2 hours and 17 minutes remaining</p>
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
        <h3>Course Contents</h3>
        <div class="lessons-list">
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
