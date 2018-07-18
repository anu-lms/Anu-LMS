import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { socketConnect } from 'socket.io-react';
import NotificationsPopup from '../../../atoms/Notifications/Popup';
import HeaderIcon from '../../../atoms/HeaderIcon';
import CloseCrossIcon from '../../../atoms/Icons/CloseCross';
import * as notificationsActions from '../../../../actions/notifications';

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpened: false };

    // True if user already subscribed to notifications socket.
    this.subscribedToSocket = false;

    this.closePopup = this.closePopup.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.markAllAsRead = this.markAllAsRead.bind(this);
    this.subscribeToSocket = this.subscribeToSocket.bind(this);
  }

  componentDidMount() {
    const { dispatch, currentUserId } = this.props;
    dispatch(notificationsActions.fetchUnread());

    // Listen for a new notification to arrive from socket.
    if (!this.subscribedToSocket && currentUserId) {
      this.subscribeToSocket();
    }
  }

  componentDidUpdate() {
    if (!this.subscribedToSocket && this.props.currentUserId) {
      this.subscribeToSocket();
    }
  }

  /**
   * Close socket connection.
   */
  componentWillUnmount() {
    const { socket, currentUserId } = this.props;

    // Unsubscribe from the socket if component unmounted.
    socket.off(`notification.user.${currentUserId}`);
  }

  closePopup() {
    this.setState({ isOpened: false });
    document.body.classList.remove('no-scroll-mobile');
  }

  /**
   * Listen for a notifications to arrive from socket.
   */
  subscribeToSocket() {
    const { socket, dispatch, currentUserId } = this.props;

    socket.on(`notification.user.${currentUserId}`, notification => {
      dispatch(notificationsActions.liveNotificationAdd(notification));
    });
    this.subscribedToSocket = true;
  }

  /**
   * Request another piece of notifications.
   */
  loadMore() {
    const { dispatch, lastFetchedTimestamp, isLoading } = this.props;

    if (!isLoading) {
      dispatch(notificationsActions.fetchRead(lastFetchedTimestamp));
      this.currentLastFetchedTimestamp = lastFetchedTimestamp;
    }
  }

  togglePopup() {
    const { dispatch, notifications } = this.props;
    this.setState(previousState => ({
      ...previousState,
      isOpened: !previousState.isOpened,
    }));

    if (!this.state.isOpened && notifications.length < 10) {
      dispatch(notificationsActions.fetchRead());
    }

    // Add no-scroll body class when popup opened and remove this class otherwise.
    if (this.state.isOpened) {
      document.body.classList.remove('no-scroll-mobile');
    }
    else {
      document.body.classList.add('no-scroll-mobile');
    }
  }

  markAllAsRead() {
    const { dispatch } = this.props;
    dispatch(notificationsActions.markAllAsRead());
    dispatch(notificationsActions.markAllAsReadInStore());
  }

  render() {
    const { isOpened } = this.state;
    const { unreadAmount, notifications, isLoading, lastFetchedTimestamp } = this.props;
    const hasMore = lastFetchedTimestamp === undefined ||
      this.currentLastFetchedTimestamp !== lastFetchedTimestamp;
    return (
      <div className={`notifications-wrapper ${isOpened ? 'popup-opened' : 'popup-closed'}`}>

        <div className="notifications-icons">
          <HeaderIcon
            className="icon-bell"
            label="Notifications"
            onClick={this.togglePopup}
            onKeyPress={this.togglePopup}
            isActive={isOpened}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="33" viewBox="0 0 28 33">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M14 32.833c1.833 0 3.333-1.5 3.333-3.333h-6.666A3.332 3.332 0 0 0 14 32.833zm10-10V14.5c0-5.117-2.733-9.4-7.5-10.533V2.833c0-1.383-1.117-2.5-2.5-2.5a2.497 2.497 0 0 0-2.5 2.5v1.134C6.717 5.1 4 9.367 4 14.5v8.333L.667 26.167v1.666h26.666v-1.666L24 22.833z" />
              </g>
            </svg>

            {unreadAmount > 0 &&
              <div className="amount">{unreadAmount > 99 ? 99 : unreadAmount}</div>
            }
          </HeaderIcon>
          <HeaderIcon
            className="icon-close"
            onClick={this.togglePopup}
            onKeyPress={this.togglePopup}
            isActive={isOpened}
          >
            <CloseCrossIcon />
          </HeaderIcon>
        </div>

        <NotificationsPopup
          notifications={notifications}
          unreadAmount={unreadAmount}
          isOpened={isOpened}
          onCloseClick={this.closePopup}
          onMarkAllAsReadClick={this.markAllAsRead}
          loadMore={this.loadMore}
          hasMore={hasMore}
          isLoading={isLoading}
        />
      </div>
    );
  }
}

Notifications.propTypes = {
  dispatch: PropTypes.func.isRequired,
  currentUserId: PropTypes.number,
  socket: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  unreadAmount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  lastFetchedTimestamp: PropTypes.number,
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Notifications.defaultProps = {
  lastFetchedTimestamp: undefined,
  currentUserId: null,
};

const mapStateToProps = ({ notifications, user }) => {
  const sortedNotifications = notifications.notifications.sort((a, b) => (b.created - a.created));

  const sortedReadNotifications = sortedNotifications.filter(item => item.isRead);
  let lastFetchedTimestamp;
  if (sortedReadNotifications.length > 0) {
    lastFetchedTimestamp = sortedReadNotifications[sortedReadNotifications.length - 1].created;
  }
  return {
    currentUserId: user.data.uid,
    notifications: sortedNotifications,
    unreadAmount: sortedNotifications.filter(item => !item.isRead).length,
    isLoading: notifications.isLoading,
    lastFetchedTimestamp,
  };
};

export default connect(mapStateToProps)(socketConnect(Notifications));
