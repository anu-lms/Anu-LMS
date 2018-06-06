import * as helpers from '../helpers/search';
import { CANCEL } from 'redux-saga';

/**
 * Make a request to the backend to perform a search.
 */
export const fetch = (request, text) => {
  let req = request
    .get('/site/search')
    .query({
      _format: 'json',
      'filter[fulltext][condition][fulltext]': text,
    });

  let promise = req.then(response => (
    response.body.map(item => ({
      ...item,
      entity: helpers.normalizeSearchItem(item),
    })
  );

  // Add saga cancellation handler to the promise. It aborts the backend
  // request if a new one kicks in.
  promise[CANCEL] = () => { req.abort(); };

  return promise;
};
