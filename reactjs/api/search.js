import { CANCEL } from 'redux-saga';
import * as helpers from '../helpers/search';

/**
 * Make a request to the backend to perform a search.
 */
export const fetch = (request, text, category = 'all') => {
  let req = request
    .get('/site/search')
    .query({
      _format: 'json',
      'filter[fulltext][condition][fulltext]': text,
      'filter[category][condition][category]': category,
    });

  let promise = req.then(response => (
    response.body.map(item => ({
      ...item,
      entity: helpers.normalizeSearchItem(item),
    }))
  ));

  // Add saga cancellation handler to the promise. It aborts the backend
  // request if a new one kicks in.
  promise[CANCEL] = () => { req.abort(); };

  return promise;
};
