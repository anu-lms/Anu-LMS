import React from 'react';
import PropTypes from 'prop-types';

const Comment = ({ comment }) => (
  <div className={`comments-item ${comment.parent ? 'nested' : ''}`}>
    <div>{comment.author.name} {comment.parent ? ` > ${comment.parent.author.name}` : ''}</div>
    <div>{comment.text}</div>
  </div>
);

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    parentId: PropTypes.number,
    parent: PropTypes.shape({
      id: PropTypes.number,
      author: PropTypes.object,
    }),
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

};

export default Comment;
