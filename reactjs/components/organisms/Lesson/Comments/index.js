import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '../../../atoms/Button';
import PageLoader from '../../../atoms/PageLoader';
import Comment from '../../../atoms/Comment';
import * as lessonCommentsActions from '../../../../actions/lessonComments';
import * as lessonCommentsHelper from '../../../../helpers/lessonComments';

// eslint-disable-next-line react/prefer-stateless-function
class lessonComments extends React.Component {
  componentDidMount() {
    const { isLoading, dispatch } = this.props;
    // When component is mounted, send action that the comments sidebar is opened.
    if (!isLoading) {
      dispatch(lessonCommentsActions.syncComments());
    }
  }

  render() {
    const { comments, isLoading } = this.props;

    return (
      <div className="lesson-comments-container">
        <div className="comments-header">
          <div className="title">All Comments</div>
          <div className="actions">
            <div className="add-new-comment">+ New Comment</div>
          </div>
        </div>

        <div className="comments-content">
          {isLoading &&
          <PageLoader />
          }

          {comments.length > 0 &&
          <div className="comments-list">
            {comments.map(rootComment => ([
              // Output Root comment.
              <Comment comment={rootComment} key={rootComment.id} />,

              // Output children comments.
              rootComment.children.map(comment => (
                <Comment comment={comment} key={comment.id} />
              )),
            ]))}
          </div>
          }

          {comments.length === 0 &&
            <div className="empty-text">
              There are no comments yet. <br /><br />
              <strong>Want to say something and get the conversation started?</strong>
            </div>
          }

          <div className="new-comment-form">
            <textarea placeholder="Start the conversation" />
            <Button block disabled>
              Add Comment
            </Button>
          </div>
        </div>
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
