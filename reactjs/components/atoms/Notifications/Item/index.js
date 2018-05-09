import React from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const NotificationItem = ({ icon, date, title, body, isRead }) => (
  <div className={`notification-item ${!isRead ? 'not-read' : ''}`}>
    <div className="header">
      <div className="type-icon">{icon}</div>

      <div className="date">
        <Moment parse="X" format="MMM Do">{date}</Moment>
      </div>
    </div>

    <div className="title">{title}</div>

    {body &&
      <div className="body">"{body}"</div>
    }
  </div>
);

NotificationItem.propTypes = {
  icon: PropTypes.node,
  date: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string,
  isRead: PropTypes.bool,
};

NotificationItem.defaultProps = {
  icon: {},
  body: '',
  isRead: false,
};

export default NotificationItem;
