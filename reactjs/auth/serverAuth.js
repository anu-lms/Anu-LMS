import Auth from './auth';

export default class extends Auth {

  constructor(req, res) {
    super();

    const cookies = req.cookies;
    this.accessToken = cookies.accessToken ? cookies.accessToken : '';
    this.refreshToken = cookies.refreshToken ? cookies.refreshToken : '';
    this.response = res;
  }

  refreshAuthenticationToken() {
    return new Promise((resolve, reject) => {
      console.log('refreshing token for server..');

      this.refreshAuthToken(this.refreshToken)
        .then((tokens) => {
          console.log('Setting server auth cookies...');

          // TODO: SET HTTP ONLY COOKIE.
          this.response.cookie('accessToken', tokens.accessToken, {
            expires: tokens.expiration,
          });
          this.response.cookie('refreshToken', tokens.refreshToken, {
            expires: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)),
          });

          this.accessToken = tokens.accessToken;
          this.refreshToken = tokens.refreshToken;

          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
