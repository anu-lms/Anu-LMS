import React from 'react';
import PropTypes from 'prop-types';

const StatusMessage = ({message, success, error, warning}) => (
  <div className={`alert alert-${success ? 'success' : ''}${error ? 'danger' : ''}${warning ? 'warning' : ''}`} role="alert">
    {message}
  </div>
);

StatusMessage.propTypes = {
  message: PropTypes.string.isRequired,
  success: PropTypes.bool,
  error: PropTypes.bool,
  warning: PropTypes.bool,
};

StatusMessage.defaultProps = {
  success: false,
  error: false,
  warning: false,
};

export default StatusMessage;
