import React from 'react';
import App from '../application/App';
import StudentDashboard from '../components/organisms/StudentDashboard';
import Button from '../components/atoms/Button';
import Separator from '../components/atoms/Separator';

const DashboardPage = () => (
  <App>
    <div className="container-fluid page-container">
      <header>
        <div className="col-auto mr-auto header__logo"><a className="header__icon-home">L</a></div>
        <div className="col-auto header__toolbar">
          <a href="#" className="header__icon-search">S</a>
          <div className="header__search"><input type="text" className="header__search-input" /></div>
          <a href="#" className="header__icon-notifications">N</a>
          <a href="#" className="header__profile"><img className="header__profile-avatar" src="https://gravatar.com/avatar/e0bcb315f3745d5cc747daa3c4c05c9a.png?s=128&d=https%3A%2F%2Fd3vv6lp55qjaqc.cloudfront.net%2Fitems%2F2t0t432s021o0s2V252v%2FImage%25202016-10-22%2520at%252012.15.41%2520AM.jpg%3Fv%3D8d32303c" /></a>
        </div>
      </header>
      <StudentDashboard />
      <footer><p>Copyright 2018 Anu © All Rights Reserved</p></footer>
    </div>
  </App>
);

export default DashboardPage;
