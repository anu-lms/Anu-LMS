import React from 'react';
import PropTypes from 'prop-types';

const HeaderIcon = ({ label, children, className, ...props }) => (
  <div className={`header-icon ${className}`} {...props}>
    <div className="icon">{children}</div>
    {label &&
      <div className="label">{label}</div>
    }
  </div>
);

HeaderIcon.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
};

HeaderIcon.defaultProps = {
  className: '',
  label: '',
};

export default HeaderIcon;
