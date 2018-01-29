import React from 'react';
import PropTypes from 'prop-types';

const TextWithHeading = ({ text, title, isNavCollapsed }) => (
  <div className="text-with-heading">
    <div className="container">
      <div className="row">
        <div className={`col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8`}>

          {title &&
          <h3>{title}</h3>
          }

          {text &&
          <div dangerouslySetInnerHTML={{ __html: text.value }} />
          }

        </div>
      </div>
    </div>
  </div>
);

TextWithHeading.propTypes = {
  text: PropTypes.shape({
    value: PropTypes.string,
    format: PropTypes.string,
  }),
  title: PropTypes.string,
  isNavCollapsed: PropTypes.bool,
  type: PropTypes.string,
  settings: PropTypes.object,
};

export default TextWithHeading;
