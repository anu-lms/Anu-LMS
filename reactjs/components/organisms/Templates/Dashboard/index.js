import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Empty from '../../../atoms/Empty';
import Card from '../../../moleculas/Course/Card';

const DashboardTemplate = ({ classes, courses, recentCourses }) => (
  <div className="student-dashboard container pb-5 pt-3 pt-md-5">

    {recentCourses.length > 0 &&
    <Fragment>

      <h4>Recent Courses</h4>

      <div className="row">
        {recentCourses.map(course => (
          <div key={course.id} className="col-12 col-md-6 col-lg-4 mb-5">
            <Card course={course} />
          </div>
        ))}
      </div>

    </Fragment>
    }

    {classes.length > 0 && classes.map(classItem => (
      <Fragment key={classItem.id}>

        <h4>{classItem.label}</h4>

        <div className="row">
          {courses
            // Leave only courses which belong to the current class item.
            .filter(course => course.groupId === classItem.id)
            .map(course => (
              <div key={course.id} className="col-12 col-md-6 col-lg-4 mb-5">
                <Card course={course} />
              </div>
            ))
          }
        </div>

        { !courses.filter(course => course.groupId === classItem.id).length &&
        <Empty message="No available courses yet." />
        }

      </Fragment>
    ))}

    {!classes.length &&
    <Empty message={"You haven't been added to any class yet. Please contact your instructor."} />
    }

  </div>
);

DashboardTemplate.propTypes = {
  courses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    imageAlt: PropTypes.string,
  })),
  classes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string,
  })),
  recentCourses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    imageAlt: PropTypes.string,
    progress: PropTypes.number,
  })),
};

export default DashboardTemplate;
