import React from 'react';
import { connect } from "react-redux";
import LessonNavigation from '../../../../components/organisms/Lesson/Navigation';
import LessonContent from '../../../../components/organisms/Lesson/Content';
import * as lessonActions from "../../../../actions/lesson";
import * as courseActions from "../../../../actions/course";
import * as lessonHelpers from '../../../../helpers/lesson';
import * as courseHelpers from '../../../../helpers/course';

class LessonPageTemplate extends React.Component {

  constructor(props) {
    super(props);

    // Get a list of course lessons from table of contents.
    this.courseLessonIds = props.toc.map(lesson => lesson.id);

    this.updateReadProgress = this.updateReadProgress.bind(this);
  }

  componentDidMount() {

    // Have to put this ugly workaround to make js calculate height
    // correctly.
    setTimeout(() => {
      this.updateReadProgress();
    }, 500);

    window.addEventListener('resize', this.updateReadProgress);
    window.addEventListener('scroll', this.updateReadProgress);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateReadProgress);
    window.removeEventListener('scroll', this.updateReadProgress);
  }

  componentDidUpdate() {
    this.updateReadProgress();
  }

  updateReadProgress() {
    const { lessons, lesson, course } = this.props;

    const readThrough = window.pageYOffset + window.innerHeight;
    const containerHeight = this.refs.container.clientHeight;
    const progress = readThrough > containerHeight ? 100 : readThrough / containerHeight * 100;

    const existingProgress = lessonHelpers.getProgress(lessons, lesson.id);
    if (progress > existingProgress) {
      this.props.dispatch(lessonActions.setProgress(lesson.id, progress));

      const index = lessons.findIndex(element => element.id === lesson.id);
      if (index !== -1) {
        lessons[index].progress = progress;
      }
      else {
        lessons.push({ id: lesson.id, progress: progress });
      }

      const courseProgress = courseHelpers.calculateProgress(lessons, this.courseLessonIds);
      this.props.dispatch(courseActions.setProgress(course.id, courseProgress));
    }
  }

  render () {
    return (
      <div>
        <LessonNavigation toc={this.props.toc} course={this.props.course} />
        <div ref="container">
          <LessonContent {...this.props.lesson} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ lesson }) => {
  return {
    lessons: lesson,
  };
};

export default connect(mapStateToProps)(LessonPageTemplate);
