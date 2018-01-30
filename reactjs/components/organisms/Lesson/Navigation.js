import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { Link } from '../../../routes';
import CollapsibleNavigation from '../../atoms/CollapsibleNavigation';
import LinkWithProgress from '../../atoms/Link/LinkWithProgress';
import * as lessonHelper from '../../../helpers/lesson';
import * as courseHelper from '../../../helpers/course';
import * as navigationActions from '../../../actions/navigation';

class LessonNavigation extends React.Component {

  /**
   * Handle additional click event on links
   * inside of table of contents.
   */
  handleTableOfContentsClick() {
    // On the mobile device you'd want the navigation to hide
    // as soon as you click on lesson inside of table of contents.
    // 768 is a bootstrap md breakpoint.
    if (window.innerWidth < 768) {
      this.props.dispatch(navigationActions.toggle());
    }
  }

  render() {
    const { toc, lessons, courses, course, router } = this.props;
    return (
      <CollapsibleNavigation className="lesson">

        <Link to={course.url}>
          <a className="course-teaser" style={{ backgroundImage: 'url("' + course.imageUrl + '")' }}>
            <div className="image-overlay" />
            <div className="title">{course.title}</div>
            <div className="progress">
              <div className="completion caption sm">{courseHelper.getProgress(courses, course.id)}% complete</div>
              <div className="progress-bar">
                <div className="current-progress" style={{ width: courseHelper.getProgress(courses, course.id) + '%' }} />
              </div>
            </div>
          </a>
        </Link>

        <div className="table-of-contents">
          <h5 className="title">Course Content</h5>
          <div className="contents">
            {toc.map(item => (
              <LinkWithProgress
                key={item.id}
                title={item.title}
                url={item.url}
                progress={lessonHelper.getProgress(lessons, item.id)}
                active={item.url === router.asPath}
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
