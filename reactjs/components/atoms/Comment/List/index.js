import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Comment from '../Item';
import AddCommentForm from '../Form';
import NewCommentsBar from '../NewCommentsBar';
import * as userHelper from '../../../../helpers/user';

class CommentsList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleNewCommentsBarClick = this.handleNewCommentsBarClick.bind(this);
  }

  handleNewCommentsBarClick() {
    const { firstUnreadCommentId } = this.props;
    console.log('handleNewCommentsBarClick', firstUnreadCommentId);
  }

  render() {
    const { comments, replyTo, unreadCommentsAmount } = this.props;
    const flatCommentsList = [];

    // Prepare list of comments.
    comments.forEach(rootComment => {
      let replyToComment = null;
      if (replyTo === rootComment.id) {
        replyToComment = rootComment;
      }

      // Add root comment to the list.
      flatCommentsList.push(<Comment comment={rootComment} key={rootComment.id} />);

      // Add all children to the list below root component.
      rootComment.children.forEach(comment => {
        flatCommentsList.push(<Comment comment={comment} key={comment.id} />);

        if (replyTo === comment.id) {
          replyToComment = comment;
        }
      });

      // Shows Reply to form at the bottom of root component thread.
      if (replyToComment) {
        const placeholder = `Reply to ${userHelper.getUsername(replyToComment.author)}`;

        flatCommentsList.push(<AddCommentForm className="nested" id="reply-comment-form" placeholder={placeholder} key={`${rootComment.id}-form`} />);
      }
    });

    return (
      <div className="comments-list">
        {unreadCommentsAmount > 0 &&
        <NewCommentsBar newCommentsAmount={unreadCommentsAmount} onClick={this.handleNewCommentsBarClick} />
        }
        {flatCommentsList}
      </div>
    );
  }
}


CommentsList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  replyTo: PropTypes.number,
  unreadCommentsAmount: PropTypes.number,
};

CommentsList.defaultProps = {
  replyTo: null,
  unreadCommentsAmount: 0,
};

const mapStateToProps = ({ lessonSidebar }) => ({
  replyTo: lessonSidebar.comments.form.replyTo,
  unreadCommentsAmount: lessonSidebar.comments.comments.filter(comment => !comment.isRead).length,
  firstUnreadCommentId: 149,
});

export default connect(mapStateToProps)(CommentsList);
