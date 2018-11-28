import React, { Component } from 'react';
import { Router } from '../../routes';
import withAuth from '../../auth/withAuth';
import withRedux from '../../store/withRedux';
import withSocket from '../../application/withSocket';
import withSentry from '../../application/withSentry';
import { validateRegistrationToken } from '../../api/user';
import SiteTemplate from '../../components/organisms/Templates/SiteTemplate';
import UserRegister from '../../components/organisms/User/Register';

class RegisterPage extends Component {
  // Skip initial redirection in withAuth module
  // (to avoid redirects for pages that should be available for anonymous).
  static skipInitialAuthRedirect = true;

  // eslint-disable-next-line no-unused-vars
  static async getInitialProps({ auth, res, request, query }) {
    const initialProps = {
      tokenValidation: {
        token: null,
        isValid: false,
        errorMessage: 'Registration link is not valid. Please contact site administrator.',
      }
    };

    // Don't allow Authentificated to access the page.
    if (auth.isLoggedIn()) {
      if (res) {
        res.redirect('/');
      }
      else {
        Router.replace('/');
      }
    }

    if (!query.token) {
      return initialProps;
    }

    const validationResponse = await validateRegistrationToken(request, query.token)
      .catch(error => {
        console.error('Could not validate registration token.', error);
        errorResponse.token = query.token;
        return initialProps;
      });

    if (!validationResponse.token) {
      return initialProps;
    }

    return {
      tokenValidation: validationResponse,
    };
  }

  render() {
    return (
      <SiteTemplate isHeaderEmpty className="page-user-registration">
        <UserRegister tokenValidation={this.props.tokenValidation} />
      </SiteTemplate>
    );
  }
}

export default withSentry(withSocket(withRedux(withAuth(RegisterPage))));
