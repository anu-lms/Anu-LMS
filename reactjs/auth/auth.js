import request from '../utils/request';

export default class {
  constructor() {
    this.accessToken = '';
    this.refreshToken = '';
  }

  /**
   * Make a request to the backend to generate a new
   * pair of access / refresh tokens.
   */
  refreshAuthToken = refreshToken => (
    new Promise((resolve, reject) => {
      console.log('Refreshing the access token...');
      request
        .post('/oauth/token')
        .send({
          'grant_type': 'refresh_token',
          'refresh_token': refreshToken,
          'client_id': process.env.CLIENT_ID,
          'client_secret': process.env.CLIENT_SECRET,
        })
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .then(({ body }) => {
          console.log('The new access token is generated.');

          this.accessToken = body.access_token;
          this.refreshToken = body.refresh_token;

          resolve({
            accessToken: body.access_token,
            expiration: new Date(new Date().getTime() + (body.expires_in * 1000)),
            refreshToken: body.refresh_token,
          });
        })
        .catch(error => {
          console.error('Could not refresh auth token.');
          reject(error);
        });
    })
  );

  getRequest() {
    request.set('Authorization', `Bearer ${this.accessToken}`);
    return request;
  }

  isLoggedIn() {
    return !!this.accessToken;
  }

  hasRefreshToken() {
    return !!this.refreshToken;
  }
}
