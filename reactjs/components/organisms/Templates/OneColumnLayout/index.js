import React from 'react';
import PropTypes from 'prop-types';

const OneColumnLayout = ({ className, pageTitle, children }) => {
  let layoutClass = 'one-column-layout container';

  // Add extra classes.
  if (className) {
    layoutClass += ` ${className}`;
  }

  return (
    <div className={layoutClass}>
      {pageTitle &&
        <div className="row justify-content-center title">
          <div className="col-12 col-md-8 col-lg-12">
            <h1 className="page-title">{pageTitle}</h1>
          </div>
        </div>
      }
      <div className="row justify-content-center content">
        <div className="col-12 col-md-8 col-lg-8">
          <div className="content-wrapper">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

OneColumnLayout.propTypes = {
  className: PropTypes.string,
  pageTitle: PropTypes.string,
  children: PropTypes.node,
};

export default OneColumnLayout;
