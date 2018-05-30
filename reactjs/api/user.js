import * as dataProcessors from '../utils/dataProcessors';

/**
 * Fetch current user.
 */
export const fetchCurrent = (request) => new Promise((resolve, reject) => {
  request
    .get('/user/me')
    .query({ '_format': 'json' })
    .then(response => {
      const user = dataProcessors.userData(response.body);
      resolve(user);
    })
    .catch(error => {
      console.error('Could not fetch current user.', error);
      reject(error);
    });
});
