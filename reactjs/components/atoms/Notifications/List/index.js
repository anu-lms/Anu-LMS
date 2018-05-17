import React from 'react';
import PropTypes from 'prop-types';
import { Scrollbars } from 'react-custom-scrollbars';
import InfiniteScroll from 'react-infinite-scroll-component';
import NotificationCommentItem, { supportedBundles as commentSupportedBundles } from '../CommentItem';

const NotificationsList = ({
  notifications, onCloseClick,
  loadMore, hasMore, isLoading,
}) => (
  <div className="list">
    <Scrollbars style={{ height: '100%' }}>
      <InfiniteScroll
        dataLength={notifications.length}
        next={loadMore}
        hasMore={hasMore}
        height={461}
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
        <div className={`spinner ${isLoading ? 'show' : ''}`}>
          <img src="/static/img/spinner-small.gif" alt="Loading..." />
        </div>
      </InfiniteScroll>
    </Scrollbars>
  </div>
);

NotificationsList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  hasMore: PropTypes.bool.isRequired,
  onCloseClick: PropTypes.func,
  loadMore: PropTypes.func,
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
};

NotificationsList.defaultProps = {
  onCloseClick: () => {},
  loadMore: () => {},
};

export default NotificationsList;
