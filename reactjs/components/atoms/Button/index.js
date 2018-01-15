import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ type, size, block, active, disabled, onClick, children }) => {

  let classes = ['btn'];

  if (type) {
    classes.push('btn-' + type);
  }

  if (size) {
    classes.push('btn-' + size);
  }

  if (block) {
    classes.push('btn-block');
  }

  if (active) {
    classes.push('btn-active');
  }

  if (disabled) {
    classes.push('btn-disabled');
  }

  return (
    <button type="button" onClick={onClick} className={classes.join(' ')}>
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['lg', 'md', 'sm', 'xs']),
  block: PropTypes.bool,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

Button.defaultProps = {
  type: 'primary',
  size: 'lg',
  block: false,
  active: false,
  disabled: false,
  onClick: () => {},
};

export default Button;
