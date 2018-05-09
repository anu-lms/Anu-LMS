import React from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const NotificationItem = ({ Icon, date, title, text, isRead, className }) => (
  <div className={`notifications-item ${className} ${!isRead ? 'not-read' : ''}`}>
    <div className="header">
      {Icon &&
        <div className="type-icon"><Icon /></div>
      }

      <div className="date" title={moment(date, 'X').format('h:mma')}>
        <Moment parse="X" format="MMM Do">{date}</Moment>
      </div>
    </div>

    {/* @todo: strip tags */}
    <div className="title" dangerouslySetInnerHTML={{ __html: title }} />

    {text &&
      <div className="text">"{text}"</div>
    }
  </div>
);

NotificationItem.propTypes = {
  Icon: PropTypes.node,
  date: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  className: PropTypes.string,
  isRead: PropTypes.bool,
};

NotificationItem.defaultProps = {
  Icon: null,
  text: '',
  isRead: false,
  className: '',
};

export default NotificationItem;
