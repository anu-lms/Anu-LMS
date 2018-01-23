import React from 'react';
import PropTypes from 'prop-types';

const Heading = ({ title, type, isNavCollapsed }) => (
  <div className="container heading">
    <div className="row">
      <div className={`col-12 offset-md-1 col-md-10 offset-lg-${isNavCollapsed ? '2' : '1'} col-lg-8`}>

        {title && type === 'text_heading' &&
        <h3>{title}</h3>
        }

        {title && type !== 'text_heading' &&
        <h4>{title}</h4>
        }

      </div>
    </div>
  </div>
);

Heading.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  isNavCollapsed: PropTypes.bool,
  settings: PropTypes.object,
};

export default Heading;
