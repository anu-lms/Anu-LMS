import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { Link } from '../../../../routes';
import CollapsibleNavigation from '../../../atoms/CollapsibleNavigation';
import LinkWithProgress from '../../../atoms/Link/LinkWithProgress';
import * as mediaBreakpoint from '../../../../utils/breakpoints';
import * as lessonHelper from '../../../../helpers/lesson';
import * as courseHelper from '../../../../helpers/course';
import * as navigationActions from '../../../../actions/navigation';
import * as lessonNotebookActions from '../../../../actions/lessonNotebook';
import LinkWithClick from '../../../atoms/Link/LinkWithClick';

class LessonNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.handleNavigationClick = this.handleNavigationClick.bind(this);
  }

  /**
   * Handle additional click event on links
   * inside of table of contents.
   */
  handleNavigationClick() {
    const { dispatch } = this.props;

    // On the mobile device you'd want the navigation to hide
    // as soon as you click on lesson inside of table of contents.
    // Hide Notebook panel as well on mobile.
    if (mediaBreakpoint.isDown('md')) {
      dispatch(navigationActions.close());
      dispatch(lessonNotebookActions.close());
    }
  }

  render() {
    const { course, courses, lessons, router } = this.props;

    return (
      <CollapsibleNavigation className="lesson">

        <Link to={course.url}>
          <a className="course-teaser" style={{ backgroundImage: `url("${course.imageUrl}")` }}>
            <div className="image-overlay" />
            <div className="title">{course.title}</div>
            <div className="progress">
              <div className="completion caption sm">{courseHelper.getProgress(courses, course)}% complete</div>
              <div className="progress-bar">
                <div className="current-progress" style={{ width: `${courseHelper.getProgress(courses, course)}%` }} />
              </div>
            </div>
          </a>
        </Link>

        {course.hasResources &&
        <Link to={course.urlResources}>
          <LinkWithClick
            href={course.urlResources}
            onCustomClick={this.handleNavigationClick}
            className={`resources-link ${course.urlResources === router.asPath ? 'active' : ''}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 20 16">
              <g fill="none" fillRule="evenodd">
                <path fill="#3E3E3E" fillRule="nonzero" d="M8 0H2C.9 0 .01.9.01 2L0 14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2h-8L8 0z" />
              </g>
            </svg>
            <span>Course Resources</span>
          </LinkWithClick>
        </Link>
        }

        <div className="table-of-contents">
          <h5 className="title">Course Content</h5>
          <div className="contents">
            {course.lessons.map(lesson => (
              <LinkWithProgress
                key={lesson.id}
                title={lesson.title}
                url={lesson.url}
                progress={lessonHelper.getProgress(lessons, lesson)}
                active={lesson.url === router.asPath}
                onClick={this.handleNavigationClick}
              />
            ))}
          </div>
        </div>

      </CollapsibleNavigation>
    );
  }
}

LessonNavigation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  course: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  courses: PropTypes.arrayOf(PropTypes.object).isRequired,
  lessons: PropTypes.arrayOf(PropTypes.object).isRequired,
  router: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = ({ lesson, course }) => ({
  lessons: lesson.lessons,
  courses: course,
});

export default connect(mapStateToProps)(withRouter(LessonNavigation));
