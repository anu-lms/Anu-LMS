import React from 'react';
import PropTypes from 'prop-types';

const PageLoader = ({ type }) => (
  <div className={type === 'fixed' ? 'page-loader-fixed' : 'page-loader'}>
    <div className="loader">
      <div className="shadow" />
      <div className="box" />
    </div>
  </div>
);

PageLoader.propTypes = {
  type: PropTypes.string,
};

PageLoader.defaultProps = {
  type: 'fixed',
};

export default PageLoader;
