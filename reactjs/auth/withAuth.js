import React from 'react';
import PropTypes from 'prop-types';
import  ClientAuth from './clientAuth';
import  ServerAuth from './serverAuth';
import { Router } from '../routes';
import request from "../utils/request";

export default function withAuth(PageComponent) {
  return class AuthenticatedPage extends React.Component {

    render() {
      return <PageComponent {...this.props} />;
    };

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
      }
    }

    login(username, password) {
      const auth = new ClientAuth();
      return auth.login(username, password);
    }

    logout() {
      // Remove login cookies.
      const auth = new ClientAuth();
      auth.logout();

      // Clear local storage.
      localStorage.clear();

      // Redirect to the frontpage.
      Router.replace('/');
    }

    refreshAuthenticationToken() {
      const auth = new ClientAuth();
      return auth.refreshAuthenticationToken();
    }

    getRequest() {
      const auth = new ClientAuth();
      return new Promise((resolve, reject) => {
        auth.getAccessToken()
          .then(accessToken => {
            request.set('Authorization', `Bearer ${accessToken}`);
            // Request as an object, because it returns promise otherwise.
            resolve({ request });
          })
          .catch(error => reject(error));
      });
    }

    static async getInitialProps(ctx) {

      const { req, res, pathname } = ctx;

      let auth = req ? new ServerAuth(req, res) : new ClientAuth();
      if (!auth.isLoggedIn() && auth.hasRefreshToken()) {
        try {
          console.log('Trying to handle page request and refresh tokens...');
          await auth.refreshAuthenticationToken();
        } catch (error) {}
      }

      // Skip redirection if Component will handle it itself (to avoid redirects for pages that should be available for anonymous).
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
        const request = auth.getRequest();

        // Await child initial props.
        const childInitialProps = await PageComponent.getInitialProps(
          // Pass request object which includes authentication.
          { request, auth, ...ctx }
        );

        // Merge child and parent initial props and return.
        return { ...childInitialProps }
      }

      return {};
    }
  }
}
