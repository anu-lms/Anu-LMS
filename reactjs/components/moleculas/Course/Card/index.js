import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '../../../../routes';
import Card from '../../../atoms/Card';
import * as courseHelpers from '../../../../helpers/course';

const CourseCard = ({ course, progress }) => (
  <Card {...course} progressPercent={progress}>
    <div className="row">
      <div className="col-6 pr-2">
        <Link to={course.url}>
          <a className="btn btn-link btn-lg btn-block">View</a>
        </Link>
      </div>
      <div className="col-6 pl-2">
        {course.recentLessonUrl &&
        <Link to={course.recentLessonUrl}>
          <a className="btn btn-primary btn-lg btn-block">Resume</a>
        </Link>
        }
      </div>
    </div>
  </Card>
);

CourseCard.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number,
    progress: PropTypes.number,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    imageAlt: PropTypes.string,
    url: PropTypes.string,
    recentLessonUrl: PropTypes.string,
  }).isRequired,
  progress: PropTypes.number.isRequired,
};

const mapStateToProps = (store, { course }) => ({
  progress: courseHelpers.getProgress(store.course, course),
});

export default connect(mapStateToProps)(CourseCard);
