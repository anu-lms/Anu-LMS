import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _includes from 'lodash/includes';
import Empty from '../../../atoms/Empty';
import Card from '../../../moleculas/Course/Card';

const DashboardTemplate = ({ orgClasses, orgRecentCourses, activeOrganization }) => (
  <div className="student-dashboard container pb-5 pt-3 pt-md-5">

    {orgRecentCourses.length > 0 &&
    <Fragment>

      <h4>Recent Courses</h4>

      <div className="row">
        {orgRecentCourses.map(course => (
          <div key={course.id} className="col-12 col-md-6 col-lg-4 mb-5">
            <Card course={course} />
          </div>
        ))}
      </div>

    </Fragment>
    }

    {orgClasses.length > 0 && orgClasses.sort((a, b) => (a.weight - b.weight)).map(classItem => (
      <Fragment key={classItem.id}>

        <h4>{classItem.label}</h4>

        <div className="row">
          {classItem.courses
            .filter(courseItem => _includes(courseItem.organization, activeOrganization))
            .sort((a, b) => (a.weight - b.weight))
            .map(course => (
              <div key={course.id} className="col-12 col-md-6 col-lg-4 mb-5">
                <Card course={course} />
              </div>
            ))
          }
        </div>

        { !classItem.courses.length &&
        <div className="mb-5">
          <Empty message="No available courses yet." />
        </div>
        }

      </Fragment>
    ))}

    {!orgClasses.length &&
    <Empty message={"You haven't been added to any class yet. Please contact your instructor."} />
    }

  </div>
);

DashboardTemplate.propTypes = {
  orgClasses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string,
    courses: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      imageUrl: PropTypes.string,
      imageAlt: PropTypes.string,
      progress: PropTypes.number,
    })),
  })).isRequired,
  orgRecentCourses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    imageAlt: PropTypes.string,
    progress: PropTypes.number,
  })).isRequired,
  activeOrganization: PropTypes.number,
};

DashboardTemplate.defaultProps = {
  activeOrganization: null,
};

const mapStateToProps = ({ user }, { classes, recentCourses }) => {
  const orgClasses = classes
    .filter(classItem => _includes(classItem.organization, user.activeOrganization));

  // Collect course ids available for current organization.
  let orgCourseIds = [];
  orgClasses.forEach(orgClass => {
    orgCourseIds += orgClass.courses.map(cource => cource.id);
  });

  // Filter recent courses to show only available recent courses for current organization.
  const orgRecentCourses = recentCourses
    .filter(courseItem =>
      _includes(orgCourseIds, courseItem.id) &&
      _includes(courseItem.organization, user.activeOrganization));

  return {
    activeOrganization: user.activeOrganization,
    orgClasses,
    orgRecentCourses,
  };
};

export default connect(mapStateToProps)(DashboardTemplate);
