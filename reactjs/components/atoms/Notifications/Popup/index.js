import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import NotificationCommentItem, { supportedBundles as commentSupportedBundles } from '../CommentItem';
import * as notificationsActions from '../../../../actions/notifications';

class NotificationsPopup extends React.Component {
  constructor(props) {
    super(props);
    this.closePopup = this.closePopup.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(notificationsActions.syncNotifications());
  }

  closePopup() {
    const { dispatch } = this.props;
    dispatch(notificationsActions.closePopup());
  }

  render() {
    const { notifications, isOpened } = this.props;

    return (
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
            <div className="button mark-as-read">Mark all as read</div>
            <div className="button close" onClick={this.closePopup}>Close Notifications</div>
          </div>
        </div>
        {isOpened &&
        <div className="scrim" onClick={this.closePopup} />
        }
      </Fragment>
    );
  }
}

NotificationsPopup.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

NotificationsPopup.defaultProps = {

};

const mapStateToProps = ({ notifications }) => ({
  notifications: notifications.notifications,
  isOpened: notifications.isOpened,
});

export default connect(mapStateToProps)(NotificationsPopup);
