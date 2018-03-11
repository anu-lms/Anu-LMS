import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from '../../../../routes';
import ResumeButton from '../../../moleculas/Course/ResumeButton';
import Instructors from '../../../moleculas/Course/Instructors';
import TimeToComplete from '../../../moleculas/Course/TimeToComplete';
import LinkWithProgress from '../../../atoms/Link/LinkWithProgress';
import { plural } from '../../../../utils/string';
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
        <Instructors instructors={course.instructors}/>
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
          <img className="course-image" src={course.imageUrl} />
          <div className="progress-bar">
            <div className="current-progress" style={{ width: courseProgress + '%' }} />
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
  storeLessons: store.lesson,
  courseProgress: courseHelper.getProgress(store.course, course)
});

export default connect(mapStateToProps)(CoursePageTemplate);
