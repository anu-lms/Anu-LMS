import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '../../../../routes';
import ResumeButton from '../../../moleculas/Course/ResumeButton';
import Instructors from '../../../moleculas/Course/Instructors';
import TimeToComplete from '../../../moleculas/Course/TimeToComplete';
import LinkWithProgress from '../../../atoms/Link/LinkWithProgress';
import * as lessonHelper from '../../../../helpers/lesson';
import * as courseHelper from '../../../../helpers/course';

const CoursePageTemplate = ({ course, storeLessons, courseProgress }) => (
  <div className="container container-course pt-3 pt-md-5">

    <div className="row">

      <div className="col-md-6 course-header">
        <h4>{course.title}</h4>

        {course.organisation.length > 0 &&
        <p className="organisation">{course.organisation}</p>
        }

        {course.instructors &&
        <Instructors instructors={course.instructors} />
        }

        <TimeToComplete
          progress={courseProgress}
          totalMinutes={course.totalMinutes}
        />

        <ResumeButton
          recentLessonUrl={course.recentLessonUrl ? course.recentLessonUrl : ''}
          lessons={course.lessons}
        />
      </div>

      <div className="col-md-6 course-cover">

        <div className="cover-image">
          <img className="course-image" alt="" src={course.imageUrl} />
          <div className="progress-bar">
            <div className="current-progress" style={{ width: `${courseProgress}%` }} />
          </div>
        </div>

        <div className="completion">
          {courseProgress}% complete
        </div>

        <ResumeButton
          recentLessonUrl={course.recentLessonUrl ? course.recentLessonUrl : ''}
          lessons={course.lessons}
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
              progress={lessonHelper.getProgress(storeLessons, lesson)}
            />
          ))}
        </div>
      </div>
      }

      <div className="col-md-6 course-overview">
        {course.description &&
        <Fragment>
          <h5>Overview</h5>
          {
            // eslint-disable-next-line react/no-danger
          }<div dangerouslySetInnerHTML={{ __html: course.description }} />
        </Fragment>
        }
        {course.hasResources &&
        <Link to={course.urlResources}>
          <a className="resources-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16">
              <g fill="none" fillRule="evenodd">
                <path fill="#3E3E3E" fillRule="nonzero" d="M8 0H2C.9 0 .01.9.01 2L0 14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-8L8 0z" />
              </g>
            </svg>
            <span>View all Course Resources here</span>
          </a>
        </Link>
        }
      </div>


    </div>
  </div>
);

CoursePageTemplate.propTypes = {
  storeLessons: PropTypes.arrayOf(PropTypes.object),
  courseProgress: PropTypes.number,
  course: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = (store, { course }) => ({
  storeLessons: store.lesson,
  courseProgress: courseHelper.getProgress(store.course, course),
});

export default connect(mapStateToProps)(CoursePageTemplate);
