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

class CoursesList extends Component {

  // Demo data (to be fetched from backend).
  courses = [
    {
      title: 'Giant Toolshed',
      url: 'course/giant-toolshed',
      imageUrl: 'https://spaceholder.cc/389x292',
      imageAlt: 'Giant Toolshed',
      progressPercent: 70
    },
    {
      title: 'Giant Toolshed',
      url: 'course/giant-toolshed-2',
      imageUrl: 'https://spaceholder.cc/389x292',
      imageAlt: 'Introduction',
      progressPercent: 10
    },
    {
      title: 'Giant Toolshed',
      url: 'course/giant-toolshed-3',
      imageUrl: 'https://spaceholder.cc/389x292',
      imageAlt: 'The 5 Gears',
      progressPercent: 0
    }
  ]

  // Render given list of couses as as grid.
  render() {
    return (
      <div className="courses-list">
        {this.courses.map(course => (
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
        ))}
      </div>
    )
  }
}

// Fetch recent courses and render with standard component.
class RecentCoursesList extends Component {

  render() {
    return (
      <CoursesList />
    )
  }
}

// Dashboard component.
class StudentDashboard extends Component {

  render() {

    return (
      <div className="student-dashboard">
        <h2>Recent Courses</h2>
        <RecentCoursesList />

        <h2>Big Foundations</h2>
        <RecentCoursesList />

      </div>
    );
  }
}

export default StudentDashboard;