import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '../../../atoms/Button';
import PageLoader from '../../../atoms/PageLoader';
import CommentsList from '../../../atoms/CommentsList';
import * as lessonCommentsActions from '../../../../actions/lessonComments';

// eslint-disable-next-line react/prefer-stateless-function
class lessonComments extends React.Component {
  render() {
    const { activeParagraphId, comments, isLoading } = this.props;

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

          {comments.length > 0 ? (
            <CommentsList comments={comments} />
          ) : (
            <div className="empty-text">
              There are no comments yet (pid {activeParagraphId}).
              <br/><br/>
              <strong>Want to say something and get the conversation started?</strong>
            </div>
          )}

          <br/><br/>
          <textarea placeholder="Start the conversation" />
          <Button block onClick={() => {this.props.dispatch(lessonCommentsActions.syncComments())}}>
            Add Comment
          </Button>
        </div>
      </div>
    );
  }
}

lessonComments.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object),
  activeParagraphId: PropTypes.number,
};

lessonComments.defaultProps = {
  activeParagraphId: 0,
};

const mapStateToProps = ({ lessonSidebar }) => ({
  activeParagraphId: lessonSidebar.comments.paragraphId,
  comments: lessonSidebar.comments.comments,
  isLoading: lessonSidebar.sidebar.isLoading,
});

export default connect(mapStateToProps)(lessonComments);
