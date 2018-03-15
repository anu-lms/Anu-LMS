import React from 'react';
import LessonNavigation from '../../../../components/organisms/Lesson/Navigation';
import LessonContent from '../../../../components/organisms/Lesson/Content';
import Notebook from '../../../../components/organisms/Lesson/Notebook';

const LessonPageTemplate = ({ course, lesson }) => (
  <div className="pt-3 pt-md-5">
    <LessonNavigation course={course} />
    <LessonContent course={course} lesson={lesson} />
    <Notebook />
  </div>
);

export default LessonPageTemplate;
