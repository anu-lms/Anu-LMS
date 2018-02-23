import React from 'react';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import LoginPageTemplate from '../components/organisms/Templates/Login';

const FrontPage = () => {
  return (
    <App>
      <LoginPageTemplate/>
    </App>
  );
};

export default withRedux(withAuth(FrontPage));
