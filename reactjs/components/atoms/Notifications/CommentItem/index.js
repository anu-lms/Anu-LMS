import React from 'react';
import PropTypes from 'prop-types';
import NotificationItem from '../Item';
import { Router } from '../../../../routes';
import * as userHelper from '../../../../helpers/user';

export const supportedBundles = [
  'add_comment_to_thread',
  'reply_to_comment',
];

const NotificationCommentItemIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <g fill="none" fillRule="evenodd">
      <path fill="#B2B2B2" fillRule="nonzero" d="M19.99 2c0-1.1-.89-2-1.99-2H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
      <path d="M-2-2h24v24H-2z" />
    </g>
  </svg>
);

class NotificationCommentItem extends React.Component {
  constructor(props) {
    super(props);
    this.onTitleClick = this.onTitleClick.bind(this);
  }

  onTitleClick() {
    const { notificationItem, closePopup } = this.props;
    Router.replaceRoute(notificationItem.comment.commentUrl);
    closePopup();
  }

  render() {
    const { triggerer, comment, created, bundle, isRead } = this.props.notificationItem;
    const { lessonTitle, text } = comment;
    const triggererName = userHelper.getUsername(triggerer);

    return (
      <NotificationItem
        Icon={NotificationCommentItemIcon}
        date={created}
        title={`<strong>${triggererName}</strong> replied to your comment in <strong>${lessonTitle}</strong>`}
        text={text}
        className={`comment comment-${bundle}`}
        isRead={isRead}
        onTitleClick={this.onTitleClick}
      />
    );
  }
}

NotificationCommentItem.propTypes = {
  notificationItem: PropTypes.shape({
    id: PropTypes.string,
    bundle: PropTypes.string,
    created: PropTypes.number,
    triggerer: PropTypes.object,
    isRead: PropTypes.bool,
    comment: PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      commentUrl: PropTypes.string,
      paragraphId: PropTypes.number,
      lessonTitle: PropTypes.string,
    }),
  }).isRequired,
  closePopup: PropTypes.func,
};

NotificationCommentItem.defaultProps = {
  closePopup: () => {},
};

export default NotificationCommentItem;
