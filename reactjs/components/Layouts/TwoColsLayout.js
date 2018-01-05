import React from 'react';
import PropTypes from 'prop-types';

const TwoColsLayout = ({ content, sidebar }) => (
  <div className="wrapper100percent">
    <div className="container m-b-50">
      <div className="row">
        <div className="col-sm-8">
          {content.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
        <div className="col-sm-4">
          {sidebar.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

TwoColsLayout.propTypes = {
  content: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ])),
  sidebar: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ])),
};

export default TwoColsLayout;
