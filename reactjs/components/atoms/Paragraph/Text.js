import React from 'react';
import PropTypes from 'prop-types';

const Text = ({ text, isNavCollapsed }) => (
  <div className="container text">
    <div className="row">
      <div className={`col-12 offset-md-1 col-md-10 offset-lg-${isNavCollapsed ? '2' : '1'} col-lg-8`}>
        <div dangerouslySetInnerHTML={{ __html: text.value }} />
      </div>
    </div>
  </div>
);

Text.propTypes = {
  text: PropTypes.shape({
    value: PropTypes.string,
    format: PropTypes.string,
  }),
  isNavCollapsed: PropTypes.bool,
  type: PropTypes.string,
  settings: PropTypes.object,
};

export default Text;
