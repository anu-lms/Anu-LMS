import React, { Component } from 'react';
import { Router } from '../../routes';
import App from '../../application/App';
import withAuth from '../../auth/withAuth';
import Header from '../../components/organisms/Header';
import ForgotPassword from '../../components/organisms/Password/Forgot';

class ForgotPasswordPage extends Component {
  // Skip initial redirection in withAuth module
  // (to avoid redirects for pages that should be available for anonymous).
  static skipInitialAuthRedirect = true;

  // eslint-disable-next-line no-unused-vars
  static async getInitialProps({
    auth, res,
  }) {
    // Don't allow Authentificated to access the page.
    if (auth.isLoggedIn()) {
      if (res) {
        res.redirect('/');
      }
      else {
        Router.replace('/');
      }
    }
    return {};
  }

  render() {
    return (
      <App>
        <Header isEmpty />
        <div className="page-with-header page-reset-password">
          <ForgotPassword />
        </div>
      </App>
    );
  }
}

export default withAuth(ForgotPasswordPage);
