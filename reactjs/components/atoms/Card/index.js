import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../../routes';

const Card = ({ imageUrl, imageAlt, title, url, children, progressPercent }) => (
  <div className="card">

    <Link to={url}>
      <a className="card-image">
        <img src={imageUrl} alt={imageAlt} />
      </a>
    </Link>

    <div className="progress-bar">
      <div className="current-progress" style={{ width: progressPercent + '%' }} />
    </div>

    <div className="heading">
      <h5>
        <Link to={url}>
          <a>{title}</a>
        </Link>
      </h5>
    </div>

    <div className="card-body">
      {children}
    </div>

  </div>
);

Card.propTypes = {
  progressPercent: PropTypes.number,
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAlt: PropTypes.string,
  url: PropTypes.string,
};

export default Card;
