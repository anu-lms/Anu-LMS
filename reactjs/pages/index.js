import React from 'react';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import LoginPageTemplate from '../components/organisms/Templates/LoginPage';

const FrontPage = () => {
  return (
    <App>
      <LoginPageTemplate/>
    </App>
  );
};

export default withAuth(FrontPage);
