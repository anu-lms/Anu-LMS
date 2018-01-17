import React, { Component } from 'react';

class StudentDashboard extends Component {

  render() {

    return (
      <div className="student-dashboard">
        <h2>Recent courses</h2>
        <div className="courses-list">
          <div className="course-item">
            <a className="course-item-link" href="#"><img src="https://spaceholder.cc/389x292" alt="" /></a>
            <h3>The Stars My Destination</h3>
            <a href="#" className="course-item__secondary-button"></a>
            <a href="#" className="course-item__primary-button"></a>
          </div>
          <div className="course-item">
            <a className="course-item-link" href="#"><img src="https://spaceholder.cc/389x292" alt="" /></a>
            <h3>Foundation and Empire</h3>
            <a href="#" className="course-item__secondary-button"></a>
            <a href="#" className="course-item__primary-button"></a>
          </div>
          <div className="course-item">
            <a className="course-item-link" href="#"><img src="https://spaceholder.cc/389x292" alt="" /></a>
            <h3>The Power of Habit</h3>
            <a href="#" className="course-item__secondary-button"></a>
            <a href="#" className="course-item__primary-button"></a>
          </div>
        </div>

        <h2>Big Foundations</h2>
        <div className="courses-list">
          <div className="course-item">
            <a className="course-item-link" href="#"><img src="https://spaceholder.cc/389x292?t=1" alt="" /></a>
            <h3>The Stars My Destination</h3>
            <a href="#" className="course-item__secondary-button"></a>
            <a href="#" className="course-item__primary-button"></a>
          </div>
          <div className="course-item">
            <a className="course-item-link" href="#"><img src="https://spaceholder.cc/389x292?t=1" alt="" /></a>
            <h3>Foundation and Empire</h3>
            <a href="#" className="course-item__secondary-button"></a>
            <a href="#" className="course-item__primary-button"></a>
          </div>
          <div className="course-item">
            <a className="course-item-link" href="#"><img src="https://spaceholder.cc/389x292?t=1" alt="" /></a>
            <h3>The Power of Habit</h3>
            <a href="#" className="course-item__secondary-button"></a>
            <a href="#" className="course-item__primary-button"></a>
          </div>
          <div className="course-item">
            <a className="course-item-link" href="#"><img src="https://spaceholder.cc/389x292?t=1" alt="" /></a>
            <h3>The Power of Habit</h3>
            <a href="#" className="course-item__secondary-button"></a>
            <a href="#" className="course-item__primary-button"></a>
          </div>
        </div>
      </div>
    );
  }
}

export default StudentDashboard;