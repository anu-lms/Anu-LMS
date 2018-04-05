import React from 'react';
import PropTypes from 'prop-types';
import { plural } from '../../../../utils/string';

const TimeToComplete = ({ totalMinutes, progress }) => {
  if (!totalMinutes) {
    return null;
  }

  if (progress === 100) {
    return (<p className="estimated-time">You&apos;ve completed this course.</p>);
  }

  const remainingMinutes = Math.ceil(totalMinutes * (100 - progress) * 0.01);
  if (remainingMinutes === 0) {
    return null;
  }
  const hours = Math.floor(remainingMinutes / 60);
  const minutes = remainingMinutes % 60;

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} ${plural(hours, 'hour', 'hours')}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${plural(minutes, 'minute', 'minutes')}`);
  }

  return (
    <p className="estimated-time">
      {parts.join(' and ')} remaining
    </p>
  );
};

TimeToComplete.propTypes = {
  totalMinutes: PropTypes.number,
  progress: PropTypes.number,
};

TimeToComplete.defaultProps = {
  totalMinutes: 0,
  progress: 0,
};

export default TimeToComplete;
