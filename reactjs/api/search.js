
/**
 * Make a request to the backend to get user notifications.
 */
export const fetch = request => new Promise((resolve, reject) => {
  request
    .get('/site/search')
    .query({
      _format: 'json',
      search_api_fulltext: 'welcome',
    })
    .then(response => {
      console.log(response);
      resolve(response.body);
    })
    .catch(error => {
      console.log('Could not fetch search results.', error);
      reject(error);
    });
});
