import * as dataProcessors from '../utils/dataProcessors';

/**
 * Make a request to the backend to get user notifications.
 */
export const fetchNotifications = request => new Promise((resolve, reject) => {
  request
    .get('/notifications?_format=json')
    .then(response => {
      resolve(dataProcessors.processNotifications(response.body));
    })
    .catch(error => {
      console.log('Could not fetch notifications.', error);
      reject(error);
    });
});
