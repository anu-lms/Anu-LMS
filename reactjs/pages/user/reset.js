import React, { Component } from 'react';
import { connect } from 'react-redux';
import App from '../../application/App';
import withAuth from '../../auth/withAuth';
import { Link } from '../../routes';
import Header from '../../components/organisms/Header';
import * as dataProcessors from '../../utils/dataProcessors';
import ResetForm from '../../components/moleculas/Form/Password/Reset';
import OneColumnLayout from '../../components/organisms/Templates/OneColumnLayout';

class ResetPasswordPage extends Component {
  static skipInitialAuthRedirect = true;

  render() {
    const { user } = this.props;
    const pageTitle = user ? 'Set a New Password' : 'Login link has expired';
    const layoutStyles = user ? 'short' : '';

    return (
      <App>
        <Header isEmpty={true}/>
        <div className="page-with-header page-reset-password">
          <OneColumnLayout pageTitle={pageTitle} className={layoutStyles}>
            {user &&
              <ResetForm user={user} tokenParams={this.props.url.query} />
            }
            {!user &&
              <div>You have tried to use a one-time login link that has expired.<br />Please request a new one on <Link to="/user/forgot"><a>Forgot Password</a></Link> page.</div>
            }
          </OneColumnLayout>
        </div>
      </App>
    );
  }

  static async getInitialProps({ request, auth, query, res }) {
    let initialProps = {};

    // Don't allow Authentificated to access the page.
    if (auth.isLoggedIn()) {
      if (res) {
        res.redirect('/');
      }
      else {
        Router.replace('/');
      }
    }

    try {
      const response = await request.get(`/user/password/reset/${query.uid}/${query.timestamp}/${query.hash}?_format=json`);
      initialProps = {
        user: dataProcessors.userData(response.body)
      };
    } catch (error) {
      console.log(error.response);
    }

    return initialProps;
  }
}

export default withAuth(ResetPasswordPage);
