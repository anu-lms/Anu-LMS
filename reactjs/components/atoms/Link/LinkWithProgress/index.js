import React from 'react';
import PropTypes from 'prop-types';
import CircularProgressbar from 'react-circular-progressbar';
import { Link } from '../../../../routes';
import LinkWithClick from '../LinkWithClick';

const LinkWithProgress = ({ title, url, progress, active, onClick }) => (
  <Link to={url} prefetch>
    <LinkWithClick
      href={url}
      onCustomClick={onClick}
      className={`link-with-progress ${progress === 100 ? 'completed' : ''} ${active ? 'active' : ''}`}
    >

      {title}

      {progress > 0 && progress < 100 &&
      <CircularProgressbar
        percentage={progress}
        textForPercentage={false}
        strokeWidth={15}
      />
      }

      {progress === 100 &&
      <span className="completed">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="6 0 20 20">
          <g fill="none" fillRule="evenodd" transform="translate(0 -2)">
            <path fill="#FFF" fillRule="nonzero" d="M16 2C10.48 2 6 6.48 6 12s4.48 10 10 10 10-4.48 10-10S21.52 2 16 2zm-2 15l-5-5 1.41-1.41L14 14.17l7.59-7.59L23 8l-9 9z" />
          </g>
        </svg>
      </span>
      }
    </LinkWithClick>
  </Link>
);

LinkWithProgress.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  active: PropTypes.bool,
  progress: PropTypes.number,
  onClick: PropTypes.func,
};

LinkWithProgress.defaultProps = {
  progress: 0,
  active: false,
  onClick: () => {},
};

export default LinkWithProgress;
