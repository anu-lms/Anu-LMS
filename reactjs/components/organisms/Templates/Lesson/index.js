import React from 'react';
import PropTypes from 'prop-types';
import LessonNavigation from '../../../../components/organisms/Lesson/Navigation';
import LessonContent from '../../../../components/organisms/Lesson/Content';
import LessonNotebook from '../../../../components/organisms/Lesson/Notebook';

const LessonPageTemplate = ({ course, lesson }) => (
  <div className="pt-3 pt-md-5">
    <LessonNavigation course={course} />
    <LessonContent course={course} lesson={lesson} />
    <LessonNotebook />
  </div>
);

LessonPageTemplate.propTypes = {
  course: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  lesson: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default LessonPageTemplate;
