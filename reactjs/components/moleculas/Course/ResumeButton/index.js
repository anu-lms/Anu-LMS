import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../../../routes';

const ResumeButton = ({ recentLessonUrl, lessons }) => (
  <Fragment>

    {recentLessonUrl &&
    <Link to={recentLessonUrl}>
      <a className="btn btn-primary btn-lg btn-block">
        Resume
      </a>
    </Link>
    }

    { !recentLessonUrl && lessons.length &&
    <Link to={lessons[0].url}>
      <a className="btn btn-primary btn-lg btn-block">
        Start
      </a>
    </Link>
    }

  </Fragment>
);

ResumeButton.propTypes = {
  recentLessonUrl: PropTypes.string,
  lessons: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

ResumeButton.defaultProps = {
  recentLessonUrl: '',
  lessons: [],
};

export default ResumeButton;
