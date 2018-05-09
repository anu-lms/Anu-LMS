import React from 'react';
import PropTypes from 'prop-types';
import NotificationItem from '../Item';
import * as userHelper from '../../../../helpers/user';

const NotificationCommentItemIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <g fill="none" fillRule="evenodd">
      <path fill="#B2B2B2" fillRule="nonzero" d="M19.99 2c0-1.1-.89-2-1.99-2H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h14l4 4-.01-18z" />
      <path d="M-2-2h24v24H-2z" />
    </g>
  </svg>
);

const NotificationCommentItem = ({ notificationItem }) => {
  const triggererName = userHelper.getUsername(notificationItem.triggerer);
  const lessonTitle = notificationItem.comment.lessonTitle;

  return (
    <NotificationItem
      icon={NotificationCommentItemIcon}
      date={notificationItem.created}
      title={`${triggererName} replied to your comment in ${lessonTitle}`}
      text={notificationItem.comment.text}
    />
  );
};

NotificationCommentItem.propTypes = {
  dispatch: PropTypes.func.isRequired,
  notificationItem: PropTypes.shape({
    id: PropTypes.string,
    bundle: PropTypes.string,
    created: PropTypes.number,
    triggerer: PropTypes.object,
    comment: PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      paragraphId: PropTypes.number,
      lessonTitle: PropTypes.string,
    }),
  }).isRequired,
};

export default NotificationCommentItem;
