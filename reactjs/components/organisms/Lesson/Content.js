import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { paragraphComponents } from '../../atoms/Paragraph';
import { Link } from '../../../routes';
import { getPrevLesson, getNextLesson } from '../../../helpers/lesson';

const LessonContent = ({ lesson, course, isNavCollapsed }) => {

  const nextLesson = getNextLesson(course.lessons, lesson.id);

  return (
    <Fragment>

      <div className="container">
        <div className="row">
          <div className={`col-12 offset-md-1 col-md-10 offset-lg-${isNavCollapsed ? '2' : '1'} col-lg-8`}>
            <h1>{lesson.title}</h1>
          </div>
        </div>
      </div>

      <div className="lesson-content">
        {lesson.blocks.map((block, index) => {
          const Paragraph = paragraphComponents[block.type];
          return <Paragraph key={index} {...block} isNavCollapsed={isNavCollapsed} />;
        })}
      </div>

      <div className="lesson-navigation container">
        <div className="row">
          <div className={`col-12 offset-md-1 col-md-10 offset-lg-${isNavCollapsed ? '2' : '1'} col-lg-8`}>
            {nextLesson !== false &&
            <Link to={nextLesson.url}>
              <a className="btn btn-primary btn-lg btn-block">Next: {nextLesson.title}</a>
            </Link>
            }
          </div>
        </div>
      </div>

    </Fragment>
  );
};

const mapStateToProps = ({ navigation }) => ({
  isNavCollapsed: navigation.isCollapsed,
});

export default connect(mapStateToProps)(LessonContent);
