import React, { Component } from 'react';
import { Router } from '../../routes';
import withAuth from '../../auth/withAuth';
import withRedux from '../../store/withRedux';
import withSocket from '../../application/withSocket';
import withSentry from '../../application/withSentry';
import SiteTemplate from '../../components/organisms/Templates/SiteTemplate';
import ForgotPassword from '../../components/organisms/Password/Forgot';

class ForgotPasswordPage extends Component {
  // Skip initial redirection in withAuth module
  // (to avoid redirects for pages that should be available for anonymous).
  static skipInitialAuthRedirect = true;

  // eslint-disable-next-line no-unused-vars
  static async getInitialProps({ auth, res }) {
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
      <SiteTemplate isHeaderEmpty className="page-reset-password">
        <ForgotPassword />
      </SiteTemplate>
    );
  }
}

export default withSentry(withSocket(withRedux(withAuth(ForgotPasswordPage))));
