import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Alert from 'react-s-alert';
import Paragraphs from '../../atoms/Paragraph';
import Button from '../../atoms/Button';
import { Link, Router } from '../../../routes';
import { setQuizResult } from '../../../actions/lesson';
import { getNextLesson, hasQuizzes, isAssessment, getQuizzesData } from '../../../helpers/lesson';
import * as lessonActions from "../../../actions/lesson";
import * as lessonHelpers from "../../../helpers/lesson";
import * as courseActions from "../../../actions/course";
import * as courseHelpers from "../../../helpers/course";

class LessonContent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isSending: false,
    };

    // Get a list of course lessons from table of contents.
    this.courseLessonIds = props.toc.map(lesson => lesson.id);

    // List of paragraphs ids from this lesson which have to report to this
    // component that they have been loaded.
    this.paragraphsToLoad = [];

    // Method is responsible for handling lesson read progress.
    this.updateReadProgress = this.updateReadProgress.bind(this);

    // These methods handle loading of paragraphs on the page.
    this.updateParagraphsList = this.updateParagraphsList.bind(this);
    this.handleParagraphLoaded = this.handleParagraphLoaded.bind(this);

    // Method is being invoked on each quiz update.
    this.handleQuizChange = this.handleQuizChange.bind(this);

    // Quizzes submit handling methods.
    this.submitAssessment = this.submitAssessment.bind(this);
    this.submitQuizzesAndRedirect = this.submitQuizzesAndRedirect.bind(this);
  }

  componentWillMount() {
    this.updateParagraphsList(this.props);
  }

  componentWillUpdate(nextProps) {
    // Gather list of paragraphs once per lesson page load.
    if (nextProps.lesson.id !== this.props.lesson.id) {
      this.updateParagraphsList(nextProps);
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateReadProgress);
    window.addEventListener('scroll', this.updateReadProgress);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateReadProgress);
    window.removeEventListener('scroll', this.updateReadProgress);
  }

  updateReadProgress() {

    // It's important to wait for the whole page to load before we can
    // start relying on container's height.
    if (this.paragraphsToLoad.length > 0) {
      return;
    }

    const { storeLessons, lesson, course } = this.props;

    const readThrough = window.pageYOffset + window.innerHeight;
    const pageHeight = document.body.offsetHeight;

    const progress = readThrough >= pageHeight ? 100 : readThrough / pageHeight * 100;

    const existingProgress = lessonHelpers.getProgress(storeLessons, lesson.id);
    if (progress > existingProgress) {
      this.props.dispatch(lessonActions.setProgress(lesson.id, progress));

      const index = storeLessons.findIndex(element => element.id === lesson.id);
      if (index !== -1) {
        storeLessons[index].progress = progress;
      }
      else {
        storeLessons.push({ id: lesson.id, progress: progress });
      }

      const courseProgress = courseHelpers.calculateProgress(storeLessons, this.courseLessonIds);
      this.props.dispatch(courseActions.setProgress(course.id, courseProgress));
    }
  }

  /**
   * We gather list of paragraphs available on the current lesson page.
   * It's needed to require each paragraph to report back that it's loaded.
   * When all paragraphs will be loaded - we can calculate the lesson progress
   * by getting the accurate page height.
   */
  updateParagraphsList(props) {

    // Clear paragraphs list.
    this.paragraphsToLoad = [];

    // Mark all blocks as "needs to be loaded".
    props.lesson.blocks.forEach(block => {
      this.paragraphsToLoad.push(block.id);

      // Handle nested blocks.
      if (typeof block.blocks !== 'undefined') {
        block.blocks.forEach(subblock => {
          this.paragraphsToLoad.push(subblock.id);
        });
      }
    });

    console.log('List of paragraphs on the page:');
    console.log(this.paragraphsToLoad);
  }

  /**
   * We require every paragraph to report that it's content was loaded.
   * It is necessary to precisely calculate page read progress without having
   * to rely on timeouts or being dependant from other data loading stuff.
   */
  handleParagraphLoaded(paragraphId) {
    const index = this.paragraphsToLoad.findIndex(id => id === paragraphId);
    if (index !== -1) {
      this.paragraphsToLoad.splice(index, 1);

      console.log('Paragraph ' + paragraphId + ' is loaded. Remaining:');
      console.log(this.paragraphsToLoad);

      if (!this.paragraphsToLoad.length ) {
        console.log('All paragraphs loaded!');
        this.updateReadProgress();
      }
    }
  }

  /**
   * Reflects each change in quiz.
   * Being executed from inside of the quiz component.
   */
  handleQuizChange(quizId, quizValue) {
    const { lesson } = this.props;
    this.props.dispatch(setQuizResult(lesson.id, quizId, quizValue));
  }

  /**
   * Handle click on "Submit Assessment" button.
   */
  submitAssessment() {
    const result = this.submitQuizzes();
    if (result) {
      Alert.success('Thank you, the assessment has been successfully submitted.');
    }
    else {
      Alert.error('We could not submit your assessment. Please, contact site administrator.');
    }
  }

  /**
   * Handle click on "Submit and Continue" button.
   */
  submitQuizzesAndRedirect() {
    const { lesson, course } = this.props;
    const nextLesson = getNextLesson(course.lessons, lesson.id);

    const result = this.submitQuizzes();
    if (result) {
      Alert.success('Thank you, the quizzes have been successfully submitted.');
      if (nextLesson) {
        Router.pushRoute(nextLesson.url).then(() => window.scrollTo(0, 0));
      }
    }
    else {
      Alert.error('We could not submit your data. Please, contact site administrator.');
    }
  }

  /**
   * Submit all quizzes within lesson to the backend.
   */
  async submitQuizzes() {
    this.setState({ isSending: true });

    console.log('Submitting data:');
    console.log(this.props.quizzesData);

    // Get superagent request with authentication.
    const request = this.context.request();

    try {
      const tokenResponse = await request.get('/session/token');
      await request
        .post('/quizzes/results')
        .set('Content-Type', 'application/json')
        .set('X-CSRF-Token', tokenResponse.text)
        .send({
          lessonId: this.props.lesson.id,
          quizzes: this.props.quizzesData,
        });

      this.setState({ isSending: false });
      return true;
    }
    catch (error) {
      console.log('error during request:');
      console.log(error);

      this.setState({ isSending: false });
      return false;
    }
  }

  render() {
    const { lesson, course, navigation } = this.props;
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
      <div

        className={`lesson-container ${navigation.isCollapsed ? 'nav-collapsed' : ''}`}
      >

        <div className="container">
          <div className="row">
            <div className="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
              <h1>{lesson.title}</h1>
            </div>
          </div>
        </div>

        <div className="lesson-content" ref={element => this.container = element}>
          <Paragraphs
            blocks={lesson.blocks}
            handleQuizChange={this.handleQuizChange}
            handleParagraphLoaded={this.handleParagraphLoaded}
          />
        </div>

        <div className="lesson-navigation container">
          <div className="row">
            <div className="col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8">
              { buttons }
            </div>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (store, ownProps) => ({
  quizzesData: getQuizzesData(store.lesson, ownProps.lesson.id),
  navigation: store.navigation,
  storeLessons: store.lesson,
});

LessonContent.contextTypes = {
  request: PropTypes.func,
};

export default connect(mapStateToProps)(LessonContent);
