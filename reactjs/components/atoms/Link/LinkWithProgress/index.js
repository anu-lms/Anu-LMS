import React from 'react';
import PropTypes from 'prop-types';
import CircularProgressbar from 'react-circular-progressbar';
import { Link } from '../../../../routes';

const LinkWithProgress = ({ title, url, progress, active }) => (
  <Link to={url}>
    <a className={`link-with-progress ${progress === 100 ? 'completed' : ''} ${active ? 'active' : ''}`}>
      {title}
      {progress > 0 && progress < 100 &&
      <CircularProgressbar
        percentage={progress}
        textForPercentage={false}
        strokeWidth={15}
      />
      }
      {progress === 100 &&
      <span className="completed" />
      }
    </a>
  </Link>
);

LinkWithProgress.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  active: PropTypes.bool,
  progress: PropTypes.number,
};

LinkWithProgress.defaultProps = {
  progress: 0,
  active: false,
};

export default LinkWithProgress;
