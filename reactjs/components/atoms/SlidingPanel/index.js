import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SlidingPanel = ({ isOpened, onClose, className, children }) => (
  <Fragment>
    <div className={classNames('sliding-panel-container', className, { 'opened': isOpened })} >
      {children}
    </div>

    {isOpened &&
      <div className="scrim dark dark-body" onClick={onClose} onKeyPress={onClose} />
    }
  </Fragment>
);

SlidingPanel.propTypes = {
  isOpened: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
};

SlidingPanel.defaultProps = {
  isOpened: false,
  className: '',
  onClose: () => {},
  children: {},
};

export default SlidingPanel;
