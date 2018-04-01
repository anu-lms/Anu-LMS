import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-s-alert';
import ClientAuth from './clientAuth';
import ServerAuth from './serverAuth';
import { Router } from '../routes';
import request from '../utils/request';
import * as lock from '../utils/lock';
import { store } from '../store/store';

export default function withAuth(PageComponent) {
  return class AuthenticatedPage extends React.Component {
    static async getInitialProps(ctx) {
      const { req, res, pathname } = ctx;

      let auth = req ? new ServerAuth(req, res) : new ClientAuth();
      if (!auth.isLoggedIn() && auth.hasRefreshToken()) {
        try {
          console.log('Trying to handle page request and refresh tokens...');
          await auth.refreshAuthenticationToken();
        } catch (error) {
          console.error('There is a problem with token refresh');
        }
      }

      // Skip redirection if Component will handle it itself
      // (to avoid redirects for pages that should be available for anonymous).
      if (!PageComponent.skipInitialAuthRedirect) {
        // Redirect to the front page if not authenticated.
        if (!auth.isLoggedIn() && pathname !== '/') {
          console.log('Redirecting to the login page...');
          if (res) {
            res.redirect('/');
          }
          else {
            Router.replace('/');
          }
        }
        // Redirect to the dashboard if authenticated.
        else if (auth.isLoggedIn() && pathname === '/') {
          console.log('Redirecting to the dashboard page...');
          if (res) {
            res.redirect('/dashboard');
          }
          else {
            Router.replace('/dashboard');
          }
        }
      }

      // Handle child component's props loading.
      if (PageComponent.getInitialProps) {
        // Get request object with injected auth data.
        const requestObject = auth.getRequest();

        // Await child initial props.
        // Pass request object which includes authentication.
        // eslint-disable-next-line max-len
        const childInitialProps = await PageComponent.getInitialProps({ request: requestObject, auth, ...ctx });

        // Merge child and parent initial props and return.
        return { ...childInitialProps };
      }

      return {};
    }

    static childContextTypes = {
      auth: PropTypes.shape({
        login: PropTypes.func,
        logout: PropTypes.func,
        getRequest: PropTypes.func,
        refreshAuthenticationToken: PropTypes.func,
      }),
    };

    getChildContext() {
      return {
        auth: {
          login: this.login.bind(this),
          logout: this.logout.bind(this),
          getRequest: this.getRequest.bind(this),
          refreshAuthenticationToken: this.refreshAuthenticationToken.bind(this),
        },
      };
    }

    getRequest() {
      const auth = new ClientAuth();
      return new Promise((resolve, reject) => {
        auth.getAccessToken()
          .then((accessToken) => {
            request.set('Authorization', `Bearer ${accessToken}`);
            // Request as an object, because it returns promise otherwise.
            resolve({ request });
          })
          .catch(error => reject(error));
      });
    }

    login(username, password) {
      const auth = new ClientAuth();
      return auth.login(username, password);
    }

    async logout() {
      // Wait for the app to safely finish off before logging out.
      await lock.waitAll();

      // Clear alerts.
      Alert.closeAll();

      // Remove login cookies.
      const auth = new ClientAuth();
      await auth.logout();

      // Clear local storage.
      localStorage.clear(); // eslint-disable-line no-undef
      // Clear in-memory Redux storage otherwise there still will be data in it.
      store.dispatch({ type: 'RESET_STORE' });

      // Redirect to the frontpage.
      Router.replace('/');
    }

    refreshAuthenticationToken() {
      const auth = new ClientAuth();
      return auth.refreshAuthenticationToken();
    }

    render() {
      return <PageComponent {...this.props} />;
    }
  };
}
