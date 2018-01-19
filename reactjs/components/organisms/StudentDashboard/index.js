import React, { Component, Fragment } from 'react';

// TODO: break this file with 7 components into files.

const colorSecondary = '#d07151';
const colorWhiteGrayAlternative = '#eaeaea';

// Render progress bar.
class ProgressBar extends Component {

  render() {
    const progressPercent = this.props.progressPercent;

    return (
      <div className="progress-bar__small" style={{
        backgroundImage: `linear-gradient(90deg, ${colorSecondary} ${progressPercent}%, ${colorWhiteGrayAlternative} ${progressPercent}%)`
      }} title={`${progressPercent}% complete`}></div>
    );
  }
}

const CourseItem = ({ course }) => (
  <div className="grid-item">
    <div className="grid-card">
      <a className="grid-card__cover" href={course.url}><img src={course.imageUrl} alt={course.imageAlt} />
        <ProgressBar progressPercent={course.progressPercent} />
      </a>
      <h3>{course.title}</h3>
      <div className="grid-card__buttons">
        <a href={course.url} className="grid-card__secondary-button">Course Home</a>
        <a href={course.url} className="grid-card__primary-button">Resume</a>
      </div>
    </div>
  </div>
);


class CoursesList extends Component {

  // Render given list of couses as as grid.
  render() {

    const { courses } = this.props;
    return (
      <div className="courses-list">

        {courses.map(course => (
          <CourseItem course={course} key={course.uuid} />
        ))}
      </div>
    )
  }
}

// Fetch recent courses and render with standard component.
class RecentCoursesList extends Component {

  render() {
    const recentCourses = this.props.recentCoursesIds.map(uuid => this.props.coursesById[uuid]);

    return (
      <CoursesList courses={recentCourses} />
    )
  }
}

const Empty = ({ message }) => (
  <div className="empty-message">{message}</div>
);

// Fetch recent courses and render with standard component.
class StudentClassesCoursesList extends Component {

  render() {
    const { classes, coursesById, coursesInClassesIds } = this.props;

    return (
      <Fragment>
        {classes.map(classItem => (
          <Fragment key={classItem.uuid}>
            <h2 key={`header-${classItem.uuid}`}>{classItem.label}</h2>
            {coursesInClassesIds[classItem.uuid].length > 0
              && <CoursesList
                courses={coursesInClassesIds[classItem.uuid].map(courseId => coursesById[courseId])}
                key={`course-list${classItem.uuid}`}
              />
            }
            {coursesInClassesIds[classItem.uuid].length === 0
              && <Empty message="No available courses yet." />
            }
          </Fragment>
        ))}
      </Fragment>
    )
  }
}


// Dashboard component.
class StudentDashboard extends Component {

  render() {

    const classesCount = this.props.classes.length;

    return (
      <div className="student-dashboard">
        {classesCount > 0 &&
          <Fragment>
            <h2>Recent Courses</h2>
            <RecentCoursesList {...this.props} />

            <StudentClassesCoursesList {...this.props} />
          </Fragment>
        }
        {classesCount === 0
          && <Empty message="You haven't been added to any class yet. Please contact your instructor." />
        }
      </div>
    );
  }
}

export default StudentDashboard;