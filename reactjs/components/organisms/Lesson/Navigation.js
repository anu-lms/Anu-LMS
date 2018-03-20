import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { Link } from '../../../routes';
import CollapsibleNavigation from '../../atoms/CollapsibleNavigation';
import LinkWithProgress from '../../atoms/Link/LinkWithProgress';
import * as mediaBreakpoint from '../../../utils/breakpoints';
import * as lessonHelper from '../../../helpers/lesson';
import * as courseHelper from '../../../helpers/course';
import * as navigationActions from '../../../actions/navigation';
import * as lessonNotebookActions from '../../../actions/lessonNotebook';

class LessonNavigation extends React.Component {

  /**
   * Handle additional click event on links
   * inside of table of contents.
   */
  handleTableOfContentsClick() {
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
          <a className="course-teaser" style={{ backgroundImage: 'url("' + course.imageUrl + '")' }}>
            <div className="image-overlay" />
            <div className="title">{course.title}</div>
            <div className="progress">
              <div className="completion caption sm">{courseHelper.getProgress(courses, course)}% complete</div>
              <div className="progress-bar">
                <div className="current-progress" style={{ width: courseHelper.getProgress(courses, course) + '%' }} />
              </div>
            </div>
          </a>
        </Link>

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
                onClick={this.handleTableOfContentsClick.bind(this)}
              />
            ))}
          </div>
        </div>

      </CollapsibleNavigation>
    );
  }
}

const mapStateToProps = ({ lesson, course }) => ({
  lessons: lesson,
  courses: course,
});

export default connect(mapStateToProps)(withRouter(LessonNavigation));
