import * as dataProcessors from '../utils/dataProcessors';

/**
 * Make a request to the backend to get user notifications.
 */
// eslint-disable-next-line max-len
export const fetchNotifications = (request, isRead, lastFetchedTimestamp) => new Promise((resolve, reject) => {
  const query = { '_format': 'json' };

  if (isRead !== undefined) {
    query.isRead = isRead ? 1 : 0;
  }

  if (lastFetchedTimestamp !== undefined) {
    query.lastFetchedTimestamp = lastFetchedTimestamp;
  }

  request
    .get('/notifications')
    .query(query)
    .then(response => {
      resolve(dataProcessors.processNotifications(response.body));
    })
    .catch(error => {
      console.error('Could not fetch notifications.', error);
      reject(error);
    });
});

/**
 * Make a request to the backend to mark all notifications as read.
 */
export const markAllAsRead = request => new Promise((resolve, reject) => {
  request
    .post('/notifications/mark-all-as-read?_format=json')
    .set('Content-Type', 'application/json')
    .then(() => {
      resolve();
    })
    .catch(error => {
      console.error('Could not mark all notifications as read.', error);
      reject(error);
    });
});

/**
 * Make a request to the backend to mark notification item as read.
 */
export const markAsRead = (request, bundle, uuid) => new Promise((resolve, reject) => {
  request
    .patch(`/jsonapi/message/${bundle}/${uuid}`)
    .send({
      data: {
        type: `message--${bundle}`,
        id: uuid,
        attributes: {
          field_message_is_read: true,
        },
      },
    })
    .then(() => {
      resolve();
    })
    .catch(error => {
      console.error('Could not mark notification as read.', error);
      reject(error);
    });
});
