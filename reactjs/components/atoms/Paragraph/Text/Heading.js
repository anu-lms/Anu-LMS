import React from 'react';
import PropTypes from 'prop-types';

const Heading = ({ title, type, isNavCollapsed }) => (
  <div className="container heading">
    <div className="row">
      <div className={`col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8`}>

        {title && type === 'text_heading' &&
        <h4>{title}</h4>
        }

        {title && type !== 'text_heading' &&
        <h5>{title}</h5>
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
