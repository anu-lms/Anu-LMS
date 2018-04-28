import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Comment from '../CommentItem';
import AddCommentForm from '../AddCommentForm';
import * as userHelper from '../../../../helpers/user';

const CommentsList = ({ comments, replyTo }) => {
  const flatCommentsList = [];

  comments.forEach(rootComment => {
    let replyToComment = null;
    if (replyTo === rootComment.id) {
      replyToComment = rootComment;
    }

    flatCommentsList.push(<Comment comment={rootComment} key={rootComment.id} />);

    rootComment.children.forEach(comment => {
      flatCommentsList.push(<Comment comment={comment} key={comment.id} />);

      if (replyTo === comment.id) {
        replyToComment = comment;
      }
    });

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
  replyTo: PropTypes.number.isRequired,
};

const mapStateToProps = ({ lessonSidebar }) => ({
  replyTo: lessonSidebar.comments.form.replyTo,
});

export default connect(mapStateToProps)(CommentsList);
