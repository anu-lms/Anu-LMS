import React from 'react';
import PropTypes from 'prop-types';

const Comment = ({ comment }) => (
  <div className="">
    <div>id: {comment.id}</div>
    <div>author: {comment.author.name}</div>
    <div>parent: {comment.parent}</div>
    <div>{comment.text}</div>
  </div>
);

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number,
    parent: PropTypes.number,
    changed: PropTypes.number,
    created: PropTypes.number,
    text: PropTypes.string,
    uuid: PropTypes.string,
    author: PropTypes.shape({
      uid: PropTypes.number,
      name: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }).isRequired,
};

export default Comment;
