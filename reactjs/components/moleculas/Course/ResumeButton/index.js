import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../../../routes';

const ResumeButton = ({ recentLesson, lessons }) => {
  let recentLessonUrl = '';

  // Find url of recently accessed lesson.
  const key = lessons.findIndex(lesson => lesson.id === recentLesson);
  if (key !== -1) {
    recentLessonUrl = lessons[key].url;
  }

  return (
    <Fragment>

      {recentLesson > 0 &&
      <Link to={recentLessonUrl}>
        <a className="btn btn-primary btn-lg btn-block">
          Resume
        </a>
      </Link>
      }

      {!recentLesson && lessons.length &&
      <Link to={lessons[0].url}>
        <a className="btn btn-primary btn-lg btn-block">
          Start
        </a>
      </Link>
      }

    </Fragment>
  );
};

ResumeButton.propTypes = {
  recentLesson: PropTypes.number.isRequired,
  lessons: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ResumeButton;
