import React from 'react';
import PropTypes from 'prop-types';
import App from '../application/App';
import withAuth from '../auth/withAuth';
import LoginPageTemplate from '../components/organisms/Templates/LoginPage';

const FrontPage = ({}, { auth }) => {
  {console.log('auth.isLogged')}
  {console.log(auth.isLogged)}
  if (auth.isLogged) {
    return (
      <App>
        <div>Logged in</div>
      </App>
    );
  }
  else {
    return (
      <App>
        <LoginPageTemplate/>
      </App>
    );
  }
};

FrontPage.contextTypes = {
  auth: PropTypes.shape({
    isLogged: PropTypes.bool,
  }),
};

export default withAuth(FrontPage);
