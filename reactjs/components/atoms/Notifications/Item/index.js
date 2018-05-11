import React from 'react';
import moment from 'moment';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import xss from 'xss';
import 'str-truncate';

const NotificationItem = ({
  Icon, date, title, text, isRead, className, onTitleClick, onItemClick,
}) => (
  <div className={`notifications-item ${className} ${!isRead ? 'not-read' : ''}`} onClick={onItemClick} onKeyPress={onItemClick}>
    <div className="header">
      {Icon &&
        <div className="type-icon"><Icon /></div>
      }

      <div className="date" title={moment(date, 'X').format('h:mma')}>
        <Moment parse="X" format="MMM Do">{date}</Moment>
      </div>
    </div>

    <div className="title">
      <span onClick={onTitleClick} onKeyPress={onTitleClick} dangerouslySetInnerHTML={{ __html: xss(title) }} />
    </div>

    {text &&
      <div className="text">"{text.truncate(200)}"</div>
    }
  </div>
);

NotificationItem.propTypes = {
  Icon: PropTypes.func,
  date: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  className: PropTypes.string,
  isRead: PropTypes.bool,
  onTitleClick: PropTypes.func,
  onItemClick: PropTypes.func,
};

NotificationItem.defaultProps = {
  Icon: null,
  text: '',
  isRead: false,
  className: '',
  onTitleClick: () => {},
  onItemClick: () => {},
};

export default NotificationItem;
