import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../Icons/Comment';

const Comments = ({ onClick, amount, active }) => (
  <span className={`comments-cta ${active ? 'active' : ''}`} onClick={onClick} onKeyPress={onClick}>
    {Icon}
    {amount &&
      <span>{amount}</span>
    }
  </span>
);

Comments.propTypes = {
  onClick: PropTypes.func.isRequired,
  amount: PropTypes.number,
  active: PropTypes.bool,
};

Comments.defaultProps = {
  amount: null,
  active: false,
};

export default Comments;
