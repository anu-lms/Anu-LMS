import React from 'react';
import { Link } from '../../../routes';

const Card = ({ imageUrl, title, url, children, progressPercent }) => (
  <div className="card">

    <Link to={url}>
      <a className="card-image">
        <img src={imageUrl} />
      </a>
    </Link>

    <div className="progress-bar">
      <div className="current-progress" style={{ width: progressPercent + '%' }} />
    </div>

    <div className="card-body">

      <h3 className="title">
        <Link to={url}>
          <a>{title}</a>
        </Link>
      </h3>

      {children}

    </div>

  </div>
);

export default Card;
