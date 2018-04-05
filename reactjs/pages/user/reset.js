import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, Router } from '../../routes';
import App from '../../application/App';
import withAuth from '../../auth/withAuth';
import Header from '../../components/organisms/Header';
import * as dataProcessors from '../../utils/dataProcessors';
import ResetForm from '../../components/moleculas/Form/Password/Reset';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';

class ResetPasswordPage extends Component {
  // Skip initial redirection in withAuth module
  // (to avoid redirects for pages that should be available for anonymous).
  static skipInitialAuthRedirect = true;

  static async getInitialProps({ request, auth, query, res }) {
    let initialProps = {};

    // Don't allow Authentificated to access the page.
    if (auth.isLoggedIn()) {
      if (res) {
        res.redirect('/');
      }
      else {
        Router.replace('/'); // eslint-disable-line no-undef
      }
    }

    try {
      const response = await request.get(`/user/password/reset/${query.uid}/${query.timestamp}/${query.hash}?_format=json`);
      initialProps = {
        user: dataProcessors.userData(response.body),
      };
    } catch (error) {
      console.log(error.response);
    }

    return initialProps;
  }

  render() {
    const { user, url } = this.props;
    const pageTitle = user ? 'Set a New Password' : 'Login link has expired';
    const layoutStyles = user ? 'short' : '';

    return (
      <App>
        <Header isEmpty />
        <div className="page-with-header page-reset-password">
          <OneColumnLayout pageTitle={pageTitle} className={layoutStyles}>
            {user &&
            <ResetForm user={user} tokenParams={url.query} />
            }
            {!user &&
            <div>You have tried to use a one-time login link that has expired.<br />Please request a new one on <Link to="/user/forgot"><a>Forgot Password</a></Link> page.</div>
            }
          </OneColumnLayout>
        </div>
      </App>
    );
  }
}

ResetPasswordPage.propTypes = {
  user: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  url: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

ResetPasswordPage.defaultProps = {
  user: {},
};

export default withAuth(ResetPasswordPage);
