import React from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const NotificationItem = ({ icon, date, title, text, isRead, className }) => (
  <div className={`notification-item ${className} ${!isRead ? 'not-read' : ''}`}>
    <div className="header">
      <div className="type-icon">{icon}</div>

      <div className="date">
        <Moment parse="X" format="MMM Do">{date}</Moment>
      </div>
    </div>

    <div className="title">{title}</div>

    {text &&
      <div className="text">"{text}"</div>
    }
  </div>
);

NotificationItem.propTypes = {
  icon: PropTypes.node,
  date: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  className: PropTypes.string,
  isRead: PropTypes.bool,
};

NotificationItem.defaultProps = {
  icon: {},
  text: '',
  isRead: false,
  className: '',
};

export default NotificationItem;
