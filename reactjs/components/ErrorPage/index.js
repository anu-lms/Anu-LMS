import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../routes';

const errors = {
  403: 'Access denied',
  404: 'Page not found',
  500: 'Unexpected error',
  502: 'Timeout exceed',
};

const ErrorPage = ({ code, message }) => (
  <div className="error-message">
    <h1>{message ? message : (errors[code] ? errors[code] : `${code} error, try refreshing the page`)}</h1>
    <Link to="/"><a>To the front page</a></Link>
  </div>
);

ErrorPage.propTypes = {
  code: PropTypes.number,
  message: PropTypes.string,
};

export default ErrorPage;
