import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

import NotificationCommentItem, { supportedBundles as commentSupportedBundles } from '../CommentItem';

class NotificationsPopup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { notifications, onCloseClick } = this.props;

    return (
      <div className="notifications-popup">
        <div className="list">
          <Scrollbars style={{ height: '100%' }}>
            {notifications.map(item => {
              if (commentSupportedBundles.indexOf(item.bundle) >= 0) {
                return <NotificationCommentItem notificationItem={item} key={item.id} />;
              }
              return null;
            })}
          </Scrollbars>
        </div>
        <div className="footer">
          <div className="button mark-as-read">Mark all as read</div>
          <div className="button close" onClick={onCloseClick}>Close Notifications</div>
        </div>
      </div>
    );
  }
}

NotificationsPopup.propTypes = {
  onCloseClick: PropTypes.func,
};

NotificationsPopup.defaultProps = {
  onCloseClick: () => {},
};

const mapStateToProps = ({ notifications }) => ({
  notifications: notifications.notifications,
});

export default connect(mapStateToProps)(NotificationsPopup);
