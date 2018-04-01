import React from 'react';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import LoginPageTemplate from '../components/organisms/Templates/Login';

const FrontPage = () => (
   <App>
    <LoginPageTemplate />
  </App>
);

export default withAuth(FrontPage);
