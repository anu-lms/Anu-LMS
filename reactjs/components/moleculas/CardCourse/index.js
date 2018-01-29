import React from 'react';
import { connect } from 'react-redux';
import { Link } from '../../../routes';
import { getProgress } from '../../../helpers/course';
import Card from '../../atoms/Card';

const CardCourse = ({ course, progress }) => (
  <Card {...course} progressPercent={progress}>
    <div className="row">
      <div className="col-6 pr-2">
        <Link to={course.url}>
          <a className="btn btn-link btn-lg btn-block">View</a>
        </Link>
      </div>
      <div className="col-6 pl-2">
        <Link to={course.url}>
          <a className="btn btn-primary btn-lg btn-block">Resume</a>
        </Link>
      </div>
    </div>
  </Card>
);

const mapStateToProps = (store, { course }) => ({
  progress: getProgress(store.course, course.id),
});

export default connect(mapStateToProps)(CardCourse);
