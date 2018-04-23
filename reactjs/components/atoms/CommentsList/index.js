import React from 'react';
import PropTypes from 'prop-types';

const CommentsList = ({ comments }) => (
  <div className="comments-list">
    {comments.map((comment) => (
      <div className="" key={comment.id}>
        <div>id: {comment.id}</div>
        <div>author: {comment.author.name}</div>
        <div>parent: {comment.parent || 'no parrent'}</div>
        <div>{comment.text}</div>
      </div>
    ))}
  </div>
);

CommentsList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    parent: PropTypes.number,
    changed: PropTypes.number.isRequired,
    created: PropTypes.number.isRequired,
    text: PropTypes.string,
    uuid: PropTypes.string.isRequired,
    author: PropTypes.shape({
      uid: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  })).isRequired,
};

export default CommentsList;
