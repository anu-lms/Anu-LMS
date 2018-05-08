import * as dataProcessors from '../utils/dataProcessors';

/**
 * Make a request to the backend to get user notifications.
 */
export const fetchNotifications = request => new Promise((resolve, reject) => {
  request
    .get('/jsonapi/notifications')
    .then(response => {
      const comments = dataProcessors.processCommentsList([response.body.data]);
      resolve(comments[0]);
    })
    .catch(error => {
      console.log('Could not fetch notifications.', error);
      reject(error);
    });
});
