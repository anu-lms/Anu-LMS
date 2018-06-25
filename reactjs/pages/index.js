import React from 'react';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import withRedux from '../store/withRedux';
import withSentry from '../application/withSentry';
import LoginPageTemplate from '../components/organisms/Templates/Login';

const FrontPage = () => (
  <App>
    <LoginPageTemplate />
  </App>
);

export default withSentry(withRedux(withAuth(FrontPage)));
