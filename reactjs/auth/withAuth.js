import React from 'react';
import PropTypes from 'prop-types';
import jsCookie from 'js-cookie';
import request from "../utils/request";

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

    render() {
      return <PageComponent />;
    }

    static childContextTypes = {
      auth: PropTypes.shape({
        isLogged: PropTypes.bool,
        login: PropTypes.func,
      }),
    };

    getChildContext() {
      return {
        auth: {
          isLogged: this.isLogged(),
          login: this.login.bind(this),
        },
      }
    }

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
          })
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .end((error, response) => {
            if (!error) {

              console.log('login response:');
              console.log(response);

              const { body } = response;
              const expiration =  new Date(new Date().getTime() + body.expires_in * 1000);

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

    static async getInitialProps({ req, res, pathname }) {

      let cookies;
      if (req) {
        cookies = req.cookies;
        console.log('server cookies');
        console.log(cookies);
      }
      else {
        cookies = jsCookie.get();
        console.log('client cookies');
        console.log(cookies);
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

          const expiration =  new Date(new Date().getTime() + body.expires_in * 1000);
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
            // TODO: Untested case. Should be working for client auth.
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

      // Redirect to the front page.
      if (!accessToken && pathname !== '/') {
        res.redirect('/');
      }

      return {
        accessToken,
        refreshToken
      };
    }

  }

}
