import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

class SlidingPanel extends React.Component {
  render() {
    const { isOpened, onClose, className, children } = this.props;

    return (
      <Fragment>
        <div className={classNames('sliding-panel-container', className, { 'opened': isOpened })} >
          {children}
        </div>

        {isOpened &&
        <div className="scrim" onClick={onClose} onKeyPress={onClose} />
        }
      </Fragment>
    );
  }
}

SlidingPanel.propTypes = {
  isOpened: PropTypes.bool,
};

SlidingPanel.defaultProps = {
  isOpened: false,
};

export default SlidingPanel;
