import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import NotificationCommentItem, { supportedBundles as commentSupportedBundles } from '../CommentItem';
import * as notificationsActions from '../../../../actions/notifications';

class NotificationsPopup extends React.Component {
  constructor(props) {
    super(props);
    this.closePopup = this.closePopup.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.hasParentClass = this.hasParentClass.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(notificationsActions.syncNotifications());
  }

  closePopup() {
    const { dispatch } = this.props;
    dispatch(notificationsActions.closePopup());
  }

  componentWillReceiveProps(nextProps) {
    // Attach outside click only if popup opened.
    if (!this.props.isOpened && nextProps.isOpened) {
      document.addEventListener('click', this.handleOutsideClick);
    }
    // Detach outside click function when popup closed.
    else if (this.props.isOpened && !nextProps.isOpened) {
      document.removeEventListener('click', this.handleOutsideClick);
    }
  }

  handleOutsideClick(e) {
    // Ignore clicks on the component itself.
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    // Igrore clicks on the notification icons.
    if (this.hasParentClass(e.target, 'notifications-icon-wrapper')) {
      return;
    }

    this.closePopup();
  }

  hasParentClass(element, classname) {
    if (!element.parentNode) {
      return false;
    }

    if (element.className && typeof element.className === 'string' && element.className.split(' ').indexOf(classname) >= 0) {
      return true;
    }

    return element.parentNode && this.hasParentClass(element.parentNode, classname);
  }

  render() {
    const { notifications, isOpened } = this.props;

    return (
      <div className={`notifications-popup ${isOpened ? 'opened' : 'closed'}`} ref={node => { this.node = node; }}>
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
