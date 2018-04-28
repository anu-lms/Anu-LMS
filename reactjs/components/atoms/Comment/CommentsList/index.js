import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Comment from '../CommentItem';
import AddCommentForm from '../AddCommentForm';
import * as userHelper from '../../../../helpers/user';

const CommentsList = ({ comments, replyTo }) => {
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
      {flatCommentsList}
    </div>
  );
};

CommentsList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
  replyTo: PropTypes.number,
};

CommentsList.defaultProps = {
  replyTo: null,
};

const mapStateToProps = ({ lessonSidebar }) => ({
  replyTo: lessonSidebar.comments.form.replyTo,
});

export default connect(mapStateToProps)(CommentsList);
