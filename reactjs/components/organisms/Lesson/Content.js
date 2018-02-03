import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import Paragraphs from '../../atoms/Paragraph';
import { Link, Router } from '../../../routes';
import { setQuizResult } from '../../../actions/lesson';
import { getNextLesson, hasQuizzes, isAssessment, getQuizzesData } from '../../../helpers/lesson';
import Button from '../../atoms/Button';

class LessonContent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSending: false,
    };

    this.handleQuizChange = this.handleQuizChange.bind(this);
    this.submitAssessment = this.submitAssessment.bind(this);
    this.submitQuizzesAndRedirect = this.submitQuizzesAndRedirect.bind(this);
  }

  handleQuizChange(quizId, quizValue) {
    const { lesson } = this.props;
    this.props.dispatch(setQuizResult(lesson.id, quizId, quizValue));
  }

  async submitAssessment() {
    await this.submitQuizzes();
    this.setState({ isSending: false });
    Alert.success('Thank you, the assessment has been successfully submitted.');
  }

  async submitQuizzesAndRedirect() {
    const { lesson, course } = this.props;
    const nextLesson = getNextLesson(course.lessons, lesson.id);

    // Start prefetching before data is saved.
    if (nextLesson) {
      Router.prefetchRoute(nextLesson.url);
    }

    await this.submitQuizzes();
    this.setState({ isSending: false });
    Alert.success('Thank you, the quizzes have been successfully submitted.');

    if (nextLesson) {
      Router.pushRoute(nextLesson.url).then(() => window.scrollTo(0, 0));
    }
  }

  submitQuizzes() {
    this.setState({ isSending: true });

    // TODO: Remove when real backend request will land here.
    return new Promise(resolve => {
      console.log('Data to submit:');
      console.log(this.props.quizzesData);
      setTimeout(() => { resolve() }, 2000);
    });
  }

  render() {
    const { lesson, course } = this.props;
    const nextLesson = getNextLesson(course.lessons, lesson.id);

    let buttons = [];

    // Add an extra button for assessments.
    if (isAssessment(lesson)) {
      buttons.push(
        <Button type="link" key="assessment" block onClick={this.submitAssessment} loading={this.state.isSending}>
          Submit Assessment
        </Button>
      )
    }

    // For lesson with quizzes we change default Next button to
    // "Submit and Continue" button.
    if (!isAssessment(lesson) && hasQuizzes(lesson)) {
      buttons.push(
        <Button type="link" key="next" block onClick={this.submitQuizzesAndRedirect} loading={this.state.isSending}>
          {nextLesson &&
          <Fragment>Submit and Continue</Fragment>
          }
          {!nextLesson &&
          <Fragment>Submit</Fragment>
          }
        </Button>
      );
    }
    else if (nextLesson) {
      buttons.push(
        <Link to={nextLesson.url} key="next" prefetch>
          <a className="btn btn-primary btn-lg btn-block">
            Next: {nextLesson.title}
          </a>
        </Link>
      );
    }

    return (
      <Fragment>

        <div className="container">
          <div className="row">
            <div className="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
              <h1>{lesson.title}</h1>
            </div>
          </div>
        </div>

        <div className="lesson-content">
          <Paragraphs blocks={lesson.blocks} handleQuizChange={this.handleQuizChange} />
        </div>

        <div className="lesson-navigation container">
          <div className="row">
            <div className="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
              { buttons }
            </div>
          </div>
        </div>

      </Fragment>
    );
  }
}

const mapStateToProps = (store, { lesson }) => ({
  quizzesData: getQuizzesData(store.lesson, lesson.id),
});

export default connect(mapStateToProps)(LessonContent);
