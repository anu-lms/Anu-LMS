import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../../routes';
import * as userApi from '../../../api/user';

const errors = {
  403: 'Access denied',
  404: 'Page not found',
  500: 'Internal error',
};

class ErrorPage extends React.Component {
  async componentDidMount() {
    const { code } = this.props;

    // If user authenticated, but got 403, we send an additional
    // request to /user/me to check if it's an actual Access denied error or
    // unexpected site error (when user logged in but can't access even /user/me).
    // Usecase: User has opened site in two different browsers and changed password in
    // one of them - he has not valid token and should be logged out in another one.
    if (code === 403 && this.context.auth.isLoggedIn()) {
      const { request } = await this.context.auth.getRequest();

      // If user authenticated, but can't get /user/me, we logout and
      // redirect him to the front page.
      await userApi
        .fetchCurrent(request)
        .catch(() => {
          this.context.auth.logout();
          throw Error('Log out user because he has no access to /user/me');
        });
    }
  }

  render() {
    const { message, code } = this.props;
    return (
      <div className="error-page">
        <h1>{message || (errors[code] ? errors[code] : `Error ${code}, try refreshing the page.`)}</h1>
        <div className="column">
          <Link to="/">
            <a className="btn btn-primary btn-lg">To the homepage</a>
          </Link>
        </div>
      </div>
    );
  }
}

ErrorPage.contextTypes = {
  auth: PropTypes.shape({
    getRequest: PropTypes.func,
    logout: PropTypes.func,
    isLoggedIn: PropTypes.func,
  }),
};

ErrorPage.propTypes = {
  code: PropTypes.number.isRequired,
  message: PropTypes.string,
};

ErrorPage.defaultProps = {
  message: undefined,
};

export default ErrorPage;
