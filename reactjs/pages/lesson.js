import React from 'react';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import LessonNavigation from '../components/organisms/LessonNavigation';

class LessonPage extends React.Component {
  render () {
    return (
      <App>
        <LessonNavigation />
      </App>
    );
  }
}

export default withRedux(withAuth(LessonPage));
