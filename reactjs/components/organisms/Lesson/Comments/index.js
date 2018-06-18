import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import { connect } from 'react-redux';
import PageLoader from '../../../atoms/PageLoader';
import CommentsList from '../../../atoms/Comment/List';
import AddCommentForm from '../../../atoms/Comment/Form';
import { scrollToElement } from '../../../../utils/scrollTo';
import EmptyText from '../../../atoms/Comment/EmptyText';
import ErrorBoundary from '../../../atoms/ErrorBoundary';
import * as lessonCommentsActions from '../../../../actions/lessonComments';
import * as lessonCommentsHelper from '../../../../helpers/lessonComments';

class lessonComments extends React.Component {
  constructor(props, context) {
    super(props, context);
    // Defines if comment highlighting already processed.
    this.commentHightlightingProcessed = false;

    this.scrollToForm = this.scrollToForm.bind(this);
  }

  componentDidMount() {
    const { isLoading, dispatch } = this.props;
    // When component is mounted, send action that the comments sidebar is opened.
    if (!isLoading) {
      dispatch(lessonCommentsActions.syncComments());
    }
  }

  /**
   * @todo: deprecated method.
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.isLoading && !nextProps.isLoading) {
      // Restore Scroll position after sidebar reload.
      const scrollableArea = document.getElementById('lesson-comments-scrollable');
      if (scrollableArea) {
        scrollableArea.scrollTop = 0;
      }
    }
  }

  componentDidUpdate() {
    const { highlightedComment, comments, isLoading, dispatch } = this.props;

    // Validate highlighted comment when comments list loaded.
    // Use DidUpdate event because `highlightedComment` variable isn't available in DidMount.
    if (highlightedComment && !isLoading && !this.commentHightlightingProcessed) {
      if (!lessonCommentsHelper.getCommentById(comments, highlightedComment)) {
        Alert.error("Referenced in url comment doesn't exists");
        console.error("Referenced comment doesn't exists", `Comment: ${highlightedComment}`);
      }
      else {
        scrollToElement(`comment-${highlightedComment}`, 'lesson-comments-scrollable', 400);
      }

      // Unhighlight a Comment in 3 sec.
      setTimeout(() => {
        dispatch(lessonCommentsActions.unhighlightComment());

        // Reset flag.
        this.commentHightlightingProcessed = false;
      }, 3000);

      // Set variable to don't double process.
      this.commentHightlightingProcessed = true;
    }
  }

  scrollToForm() {
    // Scroll user and set focus to the New comment form.
    scrollToElement('new-comment-form', 'lesson-comments-scrollable', 400, () => {
      document.getElementById('new-comment-form')
        .getElementsByTagName('textarea')[0].focus({ preventScroll: true });
    });
  }

  render() {
    const { orderedComments, isLoading } = this.props;

    return (
      <div className="lesson-comments-container">
        {isLoading &&
          <PageLoader />
        }
        <ErrorBoundary>
          <div className="lesson-comments-scrollable" id="lesson-comments-scrollable">
            <div className="comments-header">
              <div className="title">All Comments</div>
              <div className="actions">
                <div className="add-new-comment" onKeyPress={this.scrollToForm} onClick={this.scrollToForm}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                    <g fill="none" fillRule="evenodd">
                      <path fill="#431C65" fillRule="nonzero" d="M32.333 4H15.667v3.333h16.666V29L29 25.667H7.333v-10H4v10A3.333 3.333 0 0 0 7.333 29H29l6.667 6.667V7.333A3.333 3.333 0 0 0 32.333 4zM14 9H9v5H5.667V9h-5V5.667h5v-5H9v5h5V9z" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            <div className="comments-content">
              {orderedComments.length > 0 ? (
                <CommentsList comments={orderedComments} />
              ) : (
                <EmptyText />
              )}

              <AddCommentForm />
            </div>
          </div>
        </ErrorBoundary>
      </div>
    );
  }
}

lessonComments.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  orderedComments: PropTypes.arrayOf(PropTypes.object).isRequired,
  highlightedComment: PropTypes.number,
};

lessonComments.defaultProps = {
  highlightedComment: null,
};

const mapStateToProps = ({ lessonSidebar }) => ({
  comments: lessonSidebar.comments.comments,
  orderedComments: lessonCommentsHelper.getOrderedComments(lessonSidebar.comments.comments),
  isLoading: lessonSidebar.sidebar.isLoading,
  highlightedComment: lessonSidebar.comments.highlightedComment,
});

export default connect(mapStateToProps)(lessonComments);
