import React from 'react';
import PropTypes from 'prop-types';

const Comment = ({ comment }) => (
  <div className="">
    <div>id: {comment.id}</div>
    <div>author: {comment.author.name}</div>
    <div>parent: {comment.parent || 'no parrent'}</div>
    <div>{comment.text}</div>
  </div>
);

Comment.propTypes = {
  comment: PropTypes.shape({
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
  }).isRequired,
};

Comment.defaultProps = {
  parent: null,
  text: '',
};

export default Comment;
