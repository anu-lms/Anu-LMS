import React from 'react';
import LessonNavigation from '../../../../components/organisms/Lesson/Navigation';
import LessonContent from '../../../../components/organisms/Lesson/Content';

const LessonPageTemplate = (props) => (
  <div>
    <LessonNavigation toc={props.toc} course={props.course} />
    <LessonContent {...props} />
  </div>
);

export default LessonPageTemplate;
