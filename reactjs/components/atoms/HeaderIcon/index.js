import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withRouter } from 'next/router';

const HeaderIcon = ({
  label, children, className, isActive, activePaths, router, ...props
}) => {
  let active = isActive;
  if (!active && activePaths && activePaths.indexOf(router.pathname) !== -1) {
    active = true;
  }

  return (
    <div className={classNames(['header-icon', className, { active }])} {...props}>
      <div className="icon">{children}</div>
      {label &&
      <div className="label">{label}</div>
       }
    </div>
  );
};

HeaderIcon.propTypes = {
  label: PropTypes.string,
  isActive: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  router: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  activePaths: PropTypes.arrayOf(PropTypes.string),
};

HeaderIcon.defaultProps = {
  label: '',
  className: '',
  activePaths: [],
  isActive: false,
};

export default withRouter(HeaderIcon);
