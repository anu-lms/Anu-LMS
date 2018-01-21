import React from 'react';
import PropTypes from 'prop-types';
import jsCookie from 'js-cookie';
import request from "../utils/request";
import { Router } from '../routes';

export default function withAuth(PageComponent) {

  return class AuthenticatedPage extends React.Component {

    constructor(props, context) {
      super(props, context);

      this.state = {
        accessToken: props.accessToken,
        refreshToken: props.refreshToken,
      }
    }

    isLogged = () => {
      return !!this.state.accessToken
    };


    getRequest() {
      return request.set('Authorization', `Bearer ${this.state.accessToken}`);
    }

    render() {
      return <PageComponent {...this.props} />;
    };

    static childContextTypes = {
      auth: PropTypes.shape({
        isLogged: PropTypes.bool,
        login: PropTypes.func,
      }),
      request: PropTypes.object,
    };

    getChildContext() {
      return {
        auth: {
          isLogged: this.isLogged(),
          login: this.login.bind(this),
        },
        request: this.getRequest(),
      }
    };

    login(username, password) {
      return new Promise((resolve, reject) => {
        request
          .post('/oauth/token')
          .send({
            'grant_type': 'password',
            // TODO: Move to constants.
            'client_id': '9e0c1ed1-541b-45da-9360-8b41f206352c',
            'client_secret': '9uGSd3khRDf3bxQR',
            'username': username,
            'password': password,
            // You must specify allowed scopes explicitly otherwise tokens won't get proper permissions.
            'scope': ['authenticated', 'manager', 'teacher']
          })
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .end((error, response) => {
            if (!error) {

              console.log('login response:');
              console.log(response);

              const { body } = response;
              const expiration = new Date(new Date().getTime() + body.expires_in * 1000);

              jsCookie.set('accessToken', body.access_token, {
                expires: expiration
              });
              jsCookie.set('refreshToken', body.refresh_token, {
                expires: 365
              });

              this.setState({
                accessToken: body.access_token,
                refreshToken: body.refresh_token
              });

              resolve();
            }
            else {
              console.log('error:');
              console.log(error);
              console.log('response:');
              console.log(response);
              if (response && response.body && response.body.message) {
                reject(response.body.message);
              }
              reject('Could not authenticate user. Please, try again.');
            }
          });
      });
    };

    static async getInitialProps(ctx) {

      const { req, res, pathname } = ctx;

      let cookies;
      if (req) {
        cookies = req.cookies;
      }
      else {
        cookies = jsCookie.get();
      }

      let accessToken = '';
      if (cookies.accessToken) {
        accessToken = cookies.accessToken;
      }

      let refreshToken = '';
      if (cookies.refreshToken) {
        refreshToken = cookies.refreshToken;
      }

      if (!accessToken && refreshToken) {
        try {
          console.log('refreshing the token');

          const response = await request
            .post('/oauth/token')
            .send({
              'grant_type': 'refresh_token',
              'refresh_token': refreshToken,
              // TODO: Move to constants.
              'client_id': '9e0c1ed1-541b-45da-9360-8b41f206352c',
              'client_secret': '9uGSd3khRDf3bxQR'
            })
            .set('Content-Type', 'application/x-www-form-urlencoded');

          const { body } = response;

          console.log('expiration body:');
          console.log(body);

          const expiration = new Date(new Date().getTime() + body.expires_in * 1000);
          accessToken = body.access_token;
          refreshToken = body.refresh_token;

          if (req) {
            res.cookie('accessToken', accessToken, {
              expires: expiration
            });
            res.cookie('refreshToken', refreshToken, {
              expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            });
          }
          else {
            jsCookie.set('accessToken', accessToken, {
              expires: expiration
            });
            jsCookie.set('refreshToken', refreshToken, {
              expires: 365
            });
          }

          console.log('new access token:');
          console.log(accessToken);

        } catch (error) {
          console.log('Could not refresh auth token:');
          console.log(error);
        }
      }

      // Redirect to the front page if not authenticated.
      if (!accessToken && pathname !== '/') {
        if (res) {
          res.redirect('/');
        }
        else {
          Router.replace('/');
        }
      }
      // Redirect to the dashboard if authenticated.
      else if (accessToken && pathname === '/') {
        if (res) {
          res.redirect('/dashboard');
        }
        else {
          Router.replace('/dashboard');
        }
      }

      const initialProps = {
        accessToken,
        refreshToken
      };

      if (PageComponent.getInitialProps) {

        // Inject auth token into the request object.
        request
          .set('Authorization', `Bearer ${accessToken}`);

        // Await child initial props.
        const childInitialProps = await PageComponent.getInitialProps(
          // Pass request object which includes authentication.
          { request, ...ctx }
        );

        // Merge child and parent initial props and return.
        return {
          ...initialProps,
          ...childInitialProps
        }
      }

      // No child initial props found. Return only auth data.
      return initialProps;
    }

  }

}
