import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageLoader from '../../../atoms/PageLoader';
import CommentsList from '../../../atoms/Comment/CommentsList';
import AddCommentForm from '../../../atoms/Comment/AddCommentForm';
import EmptyText from '../../../atoms/Comment/EmptyText';
import * as lessonCommentsActions from '../../../../actions/lessonComments';
import * as lessonCommentsHelper from '../../../../helpers/lessonComments';

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
        {isLoading &&
          <PageLoader />
        }

        <div className="lesson-comments-scrollable">
          <div className="comments-header">
            <div className="title">All Comments</div>
            <div className="actions">
              <div className="add-new-comment">+ New Comment</div>
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