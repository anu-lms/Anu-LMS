import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../../routes';

const errors = {
  403: 'Access denied',
  404: 'Page not found',
  500: 'Internal error',
};

const ErrorPage = ({ code, message }) => (
  <div className="error-page">
    <h1>{message ? message : (errors[code] ? errors[code] : `Error ${code}, try refreshing the page.`)}</h1>
    <div className="column">
      <Link to="/">
        <a className="btn btn-primary btn-lg">To the homepage</a>
      </Link>
    </div>
  </div>
);

ErrorPage.propTypes = {
  code: PropTypes.number.isRequired,
  message: PropTypes.string,
};

export default ErrorPage;
