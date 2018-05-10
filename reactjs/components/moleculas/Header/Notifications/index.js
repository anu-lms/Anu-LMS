import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withRedux from '../../../../store/withRedux';
import NotificationsPopup from '../../../atoms/Notifications/Popup';
import * as notificationsActions from '../../../../actions/notifications';

class Notifications extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpened: false };

    this.closePopup = this.closePopup.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.markAllAsRead = this.markAllAsRead.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(notificationsActions.syncNotifications());
  }

  closePopup() {
    this.setState({ isOpened: false });
    document.body.classList.remove('no-scroll');
  }

  togglePopup() {
    this.setState({ isOpened: !this.state.isOpened });

    // Add no-scroll body class when popup opened and remove this class otherwise.
    if (this.state.isOpened) {
      document.body.classList.remove('no-scroll');
    }
    else {
      document.body.classList.add('no-scroll');
    }
  }

  markAllAsRead() {
    console.log('All notifcations marked as read!');
  }

  // @todo: potentially pass it inside Notification item via Context API.
  markAsRead(notificationId) {
    console.log(`Notification with id ${notificationId} marked as read!`);
  }

  render() {
    const { isOpened } = this.state;
    const { notificationsAmount } = this.props;
    return (
      <div className={`notifications-wrapper ${isOpened ? 'popup-opened' : 'popup-closed'}`}>

        <div className="notifications-icons">
          <div className="icon icon-bell" onClick={this.togglePopup}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="33" viewBox="0 0 28 33">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M14 32.833c1.833 0 3.333-1.5 3.333-3.333h-6.666A3.332 3.332 0 0 0 14 32.833zm10-10V14.5c0-5.117-2.733-9.4-7.5-10.533V2.833c0-1.383-1.117-2.5-2.5-2.5a2.497 2.497 0 0 0-2.5 2.5v1.134C6.717 5.1 4 9.367 4 14.5v8.333L.667 26.167v1.666h26.666v-1.666L24 22.833z" />
              </g>
            </svg>

            {notificationsAmount &&
              <div className="amount">{notificationsAmount}</div>
            }
          </div>

          <div className="icon icon-close" onClick={this.closePopup}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M14 1.41L12.59 0 7 5.59 1.41 0 0 1.41 5.59 7 0 12.59 1.41 14 7 8.41 12.59 14 14 12.59 8.41 7z" />
              </g>
            </svg>
          </div>
        </div>

        <NotificationsPopup isOpened={isOpened} onCloseClick={this.closePopup} onMarkAllAsReadClick={this.markAllAsRead} />
      </div>
    );
  }
}

Notifications.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = ({ notifications }) => ({
  notificationsAmount: notifications.notifications.length > 99 ? 99 : notifications.notifications.length,
});

export default withRedux(connect(mapStateToProps)(Notifications));
