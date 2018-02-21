import { connect } from 'react-redux';
import { Router } from '../../routes';
import App from '../../application/App';
import React, { Component } from 'react';
import withAuth from '../../auth/withAuth';
import Header from '../../components/organisms/Header';
import ForgotPassword from '../../components/organisms/Password/Forgot';

class ForgotPasswordPage extends Component {
  // Skip initial redirection in withAuth module (to avoid redirects for pages that should be available for anonymous).
  static skipInitialAuthRedirect = true;

  render() {
    return (
      <App>
        <Header isEmpty={true}/>
        <div className="page-with-header page-reset-password">
          <ForgotPassword />
        </div>
      </App>
    );
  }

  static async getInitialProps({ request, auth, query, res }) {
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
}

export default withAuth(ForgotPasswordPage);
