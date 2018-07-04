import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../Icons/Comment';

const Comments = ({ onClick, amount, active }) => (
  <span
    className={classNames('comments-cta', { active, 'empty': amount === 0 })}
    onClick={onClick}
    onKeyPress={onClick}
  >
    {Icon}
    {amount > 0 &&
      <span className="amount">{amount}</span>
    }
  </span>
);

Comments.propTypes = {
  onClick: PropTypes.func.isRequired,
  amount: PropTypes.number,
  active: PropTypes.bool,
};

Comments.defaultProps = {
  amount: 0,
  active: false,
};

export default Comments;
