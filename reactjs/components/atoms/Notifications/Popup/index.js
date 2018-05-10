import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import NotificationCommentItem, { supportedBundles as commentSupportedBundles } from '../CommentItem';

const NotificationsPopup = ({ notifications, isOpened, onCloseClick, onMarkAllAsReadClick }) => (
  <Fragment>
    <div className={`notifications-popup ${isOpened ? 'opened' : 'closed'}`}>

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
        <div className="button mark-as-read" onClick={onMarkAllAsReadClick}>Mark all as read</div>
        <div className="button close" onClick={onCloseClick}>Close Notifications</div>
      </div>

    </div>

    {isOpened &&
    <div className="scrim" onClick={onCloseClick} />
    }
  </Fragment>
);

NotificationsPopup.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isOpened: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func,
  onMarkAllAsReadClick: PropTypes.func,
};

NotificationsPopup.defaultProps = {
  onCloseClick: () => {},
  onMarkAllAsReadClick: () => {},
};

const mapStateToProps = ({ notifications }) => ({
  notifications: notifications.notifications,
});

export default connect(mapStateToProps)(NotificationsPopup);
