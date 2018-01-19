import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { Link } from '../../../routes';
import CollapsibleNavigation from '../../atoms/CollapsibleNavigation';
import LinkWithProgress from '../../atoms/Link/LinkWithProgress';
import * as lessonHelper from '../../../helpers/lesson';
import * as courseHelper from '../../../helpers/course';

const LessonNavigation = ({ toc, lessons, courses, course, router }) => (
  <CollapsibleNavigation className="lesson">

    <Link to="/">
      <a className="course-teaser" style={{ backgroundImage: 'url("' + course.image + '")' }}>
        <div className="overlay" />
        <h5 className="title">{course.title}</h5>
        <div className="progress">
          <div className="completion">{courseHelper.getProgress(courses, course.id)}% complete</div>
          <div className="progress-bar">
            <div className="current-progress" style={{ width: courseHelper.getProgress(courses, course.id) + '%' }} />
          </div>
        </div>
      </a>
    </Link>

    <div className="table-of-contents">
      <h5 className="title">Course Contents</h5>
      <div className="contents">
        {toc.map(item => (
          <LinkWithProgress
            key={item.id}
            title={item.title}
            url={item.url}
            progress={lessonHelper.getProgress(lessons, item.id)}
            active={item.id + '' === router.query.lesson}
          />
        ))}
      </div>
    </div>

  </CollapsibleNavigation>
);

const mapStateToProps = ({ lesson, course }) => ({
  lessons: lesson,
  courses: course,
});

export default connect(mapStateToProps)(withRouter(LessonNavigation));
