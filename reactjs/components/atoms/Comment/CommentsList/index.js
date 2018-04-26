import React from 'react';
import PropTypes from 'prop-types';
import Comment from '../CommentItem';

const CommentsList = ({ comments }) => (
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
);

CommentsList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CommentsList;
