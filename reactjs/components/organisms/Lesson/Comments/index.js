import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageLoader from '../../../atoms/PageLoader';
import CommentsList from '../../../atoms/Comment/List';
import AddCommentForm from '../../../atoms/Comment/Form';
import EmptyText from '../../../atoms/Comment/EmptyText';
import ErrorBoundary from '../../../atoms/ErrorBoundary';
import * as lessonCommentsActions from '../../../../actions/lessonComments';
import * as lessonCommentsHelper from '../../../../helpers/lessonComments';

class lessonComments extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.scrollToForm = this.scrollToForm.bind(this);
  }

  componentDidMount() {
    const { isLoading, dispatch } = this.props;
    // When component is mounted, send action that the comments sidebar is opened.
    if (!isLoading) {
      dispatch(lessonCommentsActions.syncComments());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLoading && !nextProps.isLoading) {
      // Restore Scroll position after sidebar reload.
      const scrollableArea = document.getElementById('lesson-comments-scrollable');
      if (scrollableArea) {
        scrollableArea.scrollTop = 0;
      }
    }
  }

  scrollToForm() {
    lessonCommentsHelper.scrollToAddCommentForm('new-comment-form');
  }

  render() {
    const { comments, isLoading } = this.props;

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
              {comments.length > 0 ? (
                <CommentsList comments={comments} />
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
};

const mapStateToProps = ({ lessonSidebar }) => ({
  comments: lessonCommentsHelper.getOrderedComments(lessonSidebar.comments.comments),
  isLoading: lessonSidebar.sidebar.isLoading,
});

export default connect(mapStateToProps)(lessonComments);
