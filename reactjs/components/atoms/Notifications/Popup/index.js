import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Empty from '../Empty';
import List from '../List';
import ErrorBoundary from '../../../atoms/ErrorBoundary';

const NotificationsPopup = ({
  notifications, unreadAmount, isOpened, onCloseClick,
  onMarkAllAsReadClick, loadMore, hasMore, isLoading,
}) => {
  const isEmpty = notifications.length === 0;
  return (
    <Fragment>
      <div className={`notifications-popup ${isOpened ? 'opened' : 'closed'} ${isEmpty ? 'empty' : ''}`}>
        <ErrorBoundary>
          {!isEmpty ? (
            <List
              notifications={notifications}
              onCloseClick={onCloseClick}
              loadMore={loadMore}
              hasMore={hasMore}
              isLoading={isLoading}
            />
          ) : (
            <Empty isLoading={isLoading} />
          )}

          <div className="footer">
            <button
              className="mark-as-read"
              disabled={isEmpty || unreadAmount === 0}
              onClick={onMarkAllAsReadClick}
            >
            Mark all as read
            </button>
            <button className="close" onClick={onCloseClick} onKeyPress={onCloseClick}>Close Notifications</button>
          </div>

        </ErrorBoundary>
      </div>

      {isOpened &&
        <div className="scrim" onClick={onCloseClick} onKeyPress={onCloseClick} />
      }
    </Fragment>);
};

NotificationsPopup.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  isOpened: PropTypes.bool.isRequired,
  unreadAmount: PropTypes.number.isRequired,
  onCloseClick: PropTypes.func,
  onMarkAllAsReadClick: PropTypes.func,
  loadMore: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
};

NotificationsPopup.defaultProps = {
  onCloseClick: () => {},
  onMarkAllAsReadClick: () => {},
  loadMore: () => {},
};

export default NotificationsPopup;
