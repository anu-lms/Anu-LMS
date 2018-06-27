import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

class SlidingPanel extends React.Component {
  render() {
    const { isOpened, className, children } = this.props;

    return (
      <div className={classNames('sliding-panel-container', className, { 'opened': isOpened })} >
        {children}
      </div>
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
