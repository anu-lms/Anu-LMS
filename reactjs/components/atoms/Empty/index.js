import React from 'react';
import PropTypes from 'prop-types';

const EmptyMessage = ({ message }) => (
  <div className="empty-message">{message}</div>
);

EmptyMessage.propTypes = {
  message: PropTypes.string,
};

export default EmptyMessage;
