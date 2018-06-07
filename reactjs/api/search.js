import * as helpers from '../helpers/search';

/**
 * Make a request to the backend to perform a search.
 */
export const fetch = (request, text) => new Promise((resolve, reject) => {
  request
    .get('/site/search')
    .query({
      _format: 'json',
      'filter[fulltext][condition][fulltext]': text,
    })
    .then(response => {
      const items = response.body.map(item => ({
        ...item,
        entity: helpers.normalizeSearchItem(item),
      }));

      resolve(items);
    })
    .catch(error => {
      console.log('Could not fetch search results.', error);
      reject(error);
    });
});
