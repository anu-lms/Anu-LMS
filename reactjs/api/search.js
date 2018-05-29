
/**
 * Make a request to the backend to get user notifications.
 */
export const fetch = request => new Promise((resolve, reject) => {
  request
    .get('/site/search')
    .query({
      _format: 'json',
      'filter[fulltext][condition][fulltext]': 'search', // @todo: replace hardcoded value.
    })
    .then(response => {
      resolve(response.body);
    })
    .catch(error => {
      console.log('Could not fetch search results.', error);
      reject(error);
    });
});
