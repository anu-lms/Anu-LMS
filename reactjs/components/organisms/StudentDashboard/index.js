import React, { Component } from 'react';

const colorPrimary = '#12b3a4';
const colorWhiteGrayAlternative = '#eaeaea';

// Render progress bar.
class ProgressBar extends Component {

  render() {
    const progressPercent = this.props.progressPercent;

    return (
      <div className="progress-bar__small" style={{
        backgroundImage: `linear-gradient(90deg, ${colorPrimary} ${progressPercent}%, ${colorWhiteGrayAlternative} ${progressPercent}%)`
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

// Dashboard component.
class StudentDashboard extends Component {

  render() {

    return (
      <div className="student-dashboard">
        <h2>Recent Courses</h2>
        <RecentCoursesList {...this.props} />

        <h2>Big Foundations</h2>
        <RecentCoursesList {...this.props} />

      </div>
    );
  }
}

export default StudentDashboard;