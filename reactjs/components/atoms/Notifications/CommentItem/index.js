import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NotificationItem from '../Item';
import Icon from '../../Icons/Comment';
import { Router } from '../../../../routes';
import * as userHelper from '../../../../helpers/user';
import * as notificationActions from '../../../../actions/notifications';

export const supportedBundles = [
  'add_comment_to_thread',
  'reply_to_comment',
];

class NotificationCommentItem extends React.Component {
  constructor(props) {
    super(props);
    this.onTitleClick = this.onTitleClick.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
  }

  onTitleClick() {
    const { notificationItem, closePopup } = this.props;
    if (notificationItem.comment.url) {
      Router.replaceRoute(notificationItem.comment.url);
      closePopup();
    }
  }

  onItemClick() {
    const { notificationItem, dispatch } = this.props;

    if (!notificationItem.isRead) {
      dispatch(notificationActions.markAsRead(notificationItem.id));
      dispatch(notificationActions.markAsReadInStore(notificationItem.id));
    }
  }

  render() {
    const { triggerer, comment, created, bundle, isRead } = this.props.notificationItem;
    const { lesson, text } = comment;
    const triggererName = userHelper.getUsername(triggerer);
    let titleCopy = 'replied to your comment in';
    if (bundle === 'add_comment_to_thread') {
      titleCopy = 'commented in your thread in';
    }

    return (
      <NotificationItem
        icon={Icon}
        date={created}
        title={`<strong>${triggererName}</strong> ${titleCopy} <strong>${lesson.title}</strong>`}
        text={text}
        className={`comment comment-${bundle}`}
        isRead={isRead}
        onTitleClick={this.onTitleClick}
        onItemClick={this.onItemClick}
      />
    );
  }
}

NotificationCommentItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  notificationItem: PropTypes.shape({
    id: PropTypes.number,
    bundle: PropTypes.string,
    created: PropTypes.number,
    triggerer: PropTypes.object,
    isRead: PropTypes.bool,
    comment: PropTypes.shape({
      id: PropTypes.number,
      text: PropTypes.string,
      url: PropTypes.string,
      paragraphId: PropTypes.number,
      lesson: PropTypes.object,
    }),
  }).isRequired,
  closePopup: PropTypes.func,
};

NotificationCommentItem.defaultProps = {
  closePopup: () => {},
};

export default connect()(NotificationCommentItem);
