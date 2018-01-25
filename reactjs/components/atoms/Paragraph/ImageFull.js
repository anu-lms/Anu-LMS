import React from 'react';
import PropTypes from 'prop-types';
import { fileUrl } from '../../../utils/url';

const ImageFull = ({ image, text, isNavCollapsed }) => (
  <div className="image-full" style={{ backgroundImage: `url("${fileUrl(image.meta.derivatives['w1400'])}")`}}>
    <div className="overlay" />
    <div className="container">
      <div className="row">
        <div className={`col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8`}>
          {text &&
          <div className="text" dangerouslySetInnerHTML={{ __html: text.value }} />
          }
        </div>
      </div>
    </div>
  </div>
);

ImageFull.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string,
    meta: PropTypes.shape({
      derivatives: PropTypes.shape({
        w1400: PropTypes.string,
      }),
    }),
  }),
  text: PropTypes.shape({
    value: PropTypes.string,
    format: PropTypes.string,
  }),
  type: PropTypes.string,
  isNavCollapsed: PropTypes.bool,
  settings: PropTypes.object,
};

export default ImageFull;
