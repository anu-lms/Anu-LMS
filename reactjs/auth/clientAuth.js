import jsCookie from 'js-cookie';
import Auth from './auth';
import request from '../utils/request';

export default class extends Auth {
  constructor() {
    super();

    let cookies = jsCookie.get();
    this.accessToken = cookies.accessToken ? cookies.accessToken : '';
    this.refreshToken = cookies.refreshToken ? cookies.refreshToken : '';
  }

  login = (username, password) => (
    new Promise((resolve, reject) => {
      request
        .post('/oauth/token')
        .send({
          'grant_type': 'password',
          'client_id': process.env.CLIENT_ID,
          'client_secret': process.env.CLIENT_SECRET,
          'username': username,
          'password': password,
          // You must specify allowed scopes explicitly
          // otherwise tokens won't get proper permissions.
          'scope': ['authenticated', 'manager', 'teacher'],
        })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .end((error, response) => {
          if (!error) {
            console.log('Successful login.');
            const { body } = response;
            jsCookie.set('accessToken', body.access_token, {
              expires: new Date(new Date().getTime() + (body.expires_in * 1000)),
            });
            jsCookie.set('refreshToken', body.refresh_token, {
              expires: 365,
            });

            resolve();
          }
          else {
            console.error('Auth error:', error);

            if (response && response.body && response.body.message) {
              console.log('Response:', response.body.message);
              reject(response.body.message);
            }

            reject(new Error('Could not authenticate user. Please, try again.'));
          }
        });
    })
  );

  logout = () => (
    new Promise(resolve => {
      request
        .post('/user/token/revoke')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.accessToken}`)
        .query({ '_format': 'json' })
        .end((error, response) => {
          if (error) {
            console.error('Logout error:', error);
            if (response && response.body && response.body.message) {
              console.error('Response:', response);
            }
          }

          this.accessToken = '';
          this.refreshToken = '';
          jsCookie.remove('accessToken');
          jsCookie.remove('refreshToken');
          resolve();
        });
    })
  );

  refreshAuthenticationToken() {
    return new Promise((resolve, reject) => {
      console.log('refreshing token for client..');

      this.refreshAuthToken(this.refreshToken)
        .then(tokens => {
          console.log('Setting client auth cookies...');

          // TODO: SET HTTP ONLY COOKIE.
          jsCookie.set('accessToken', tokens.accessToken, {
            expires: tokens.expiration,
          });
          jsCookie.set('refreshToken', tokens.refreshToken, {
            expires: 365,
          });

          this.accessToken = tokens.accessToken;
          this.refreshToken = tokens.refreshToken;

          resolve(tokens.accessToken);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getAccessToken() {
    if (this.accessToken) {
      return new Promise(resolve => resolve(this.accessToken));
    }

    return this.refreshAuthenticationToken();
  }
}
