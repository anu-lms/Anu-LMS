import React from 'react';
import PropTypes from 'prop-types';

const Divider = ({ type, counter, isNavCollapsed }) => (
  <div className="container divider">
    <div className="row">
      <div className={`col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8`}>
        <div className="baseline" />
        {type === 'divider_numbered' &&
        <div className="number">{counter}</div>
        }
      </div>
    </div>
  </div>
);

Divider.propTypes = {
  counter: PropTypes.number,
  type: PropTypes.string,
  settings: PropTypes.object,
  isNavCollapsed: PropTypes.bool,
};

export default Divider;
