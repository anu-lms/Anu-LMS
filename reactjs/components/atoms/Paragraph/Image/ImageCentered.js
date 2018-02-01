import React from 'react';
import PropTypes from 'prop-types';
import { fileUrl } from '../../../../utils/url';

const ImageCentered = ({ image, title, isNavCollapsed }) => (
  <div className="container image-centered">
    <div className="row">
      <div className={`col-12 offset-md-1 col-md-10 offset-lg-2 col-lg-8`}>
        <img src={fileUrl(image.meta.derivatives['w730'])} />
        { title &&
        <div className="caption">{title}</div>
        }
      </div>
    </div>
  </div>
);

ImageCentered.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string,
    meta: PropTypes.shape({
      derivatives: PropTypes.shape({
        w730: PropTypes.string,
      }),
    }),
  }),
  title: PropTypes.string,
  type: PropTypes.string,
  isNavCollapsed: PropTypes.bool,
  settings: PropTypes.object,
};

export default ImageCentered;
