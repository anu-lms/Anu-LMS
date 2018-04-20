import React from 'react';
import PropTypes from 'prop-types';

const CommentsCTA = ({ onClick, amount, active }) => (
  <span className={`comments-cta ${active ? 'active' : ''}`} onClick={onClick} onKeyPress={onClick}>
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
      <g fill="none" fillRule="evenodd">
        <path fill="#b2b2b2" fillRule="nonzero" d="M19.99 2c0-1.1-.89-2-1.99-2H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z"/>
      </g>
    </svg>
    {amount &&
      <span>{amount}</span>
    }
  </span>
);

CommentsCTA.propTypes = {
  onClick: PropTypes.func.isRequired,
  amount: PropTypes.number,
  active: PropTypes.bool,
};

CommentsCTA.defaultProps = {
  amount: null,
  active: false,
};

export default CommentsCTA;
