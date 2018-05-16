import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroll-component';
import NotificationCommentItem, { supportedBundles as commentSupportedBundles } from '../CommentItem';
import Empty from '../Empty';

// eslint-disable-next-line max-len
const NotificationsPopup = ({
  notifications, unreadAmount, isOpened, onCloseClick, onMarkAllAsReadClick, loadMore, hasMore, isLoading,
}) => {
  const isEmpty = notifications.length === 0;
  return (
    <Fragment>
      <div className={`notifications-popup ${isOpened ? 'opened' : 'closed'} ${isEmpty ? 'empty' : ''}`}>

        {!isEmpty ? (
          <div className="list">
            <Scrollbars style={{ height: '100%' }}>
              <InfiniteScroll
                dataLength={notifications.length}
                next={loadMore}
                hasMore={hasMore}
                height={460}
              >
                {notifications.map(item => {
                  if (commentSupportedBundles.indexOf(item.bundle) >= 0) {
                    return (
                      <NotificationCommentItem
                        notificationItem={item}
                        key={item.id}
                        closePopup={onCloseClick}
                      />
                    );
                  }
                  return null;
                })}
                {isLoading &&
                  <div>Loading...</div>
                }
              </InfiniteScroll>
            </Scrollbars>
          </div>
        ) : (
          <Empty />
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

      </div>

      {isOpened &&
        <div className="scrim" onClick={onCloseClick} onKeyPress={onCloseClick} />
      }
    </Fragment>);
};

NotificationsPopup.propTypes = {
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
