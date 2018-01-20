import React from 'react';
import { Link } from '../../../routes';
import Card from '../../atoms/Card';

const CardCourse = ({ course }) => (
  <Card {...course}>
    <div className="row">
      <div className="col-6 pr-2">
        <Link to="/">
          <a className="btn btn-link btn-lg btn-block">View</a>
        </Link>
      </div>
      <div className="col-6 pl-2">
        <Link to="/">
          <a className="btn btn-primary btn-lg btn-block">Resume</a>
        </Link>
      </div>
    </div>
  </Card>
);

export default CardCourse;
