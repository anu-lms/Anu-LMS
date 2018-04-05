import React from 'react';
import PropTypes from 'prop-types';
import { plural } from '../../../../utils/string';

const Instructors = ({ instructors }) => {
  if (!instructors.length) {
    return null;
  }

  return (
    <p className="instructors">
      {plural(instructors.length, 'Instructor', 'Instructors')}:{' '}
      <span>{
        instructors
          .map(instructor => instructor.realname).join(', ')
      }
      </span>
    </p>
  );
};

Instructors.propTypes = {
  instructors: PropTypes.arrayOf(PropTypes.object),
};

Instructors.defaultProps = {
  instructors: [],
};

export default Instructors;
