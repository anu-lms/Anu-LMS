import * as dataProcessors from '../utils/dataProcessors';
import { CANCEL } from 'redux-saga';

/**
 * Make a request to the backend to perform a search.
 */
export const fetch = (request, text) => {
  let req = request
    .get('/site/search')
    .query({
      _format: 'json', 'filter[fulltext][condition][fulltext]': text,
    });

  let promise = req.then(response => (
    // @todo: an example of normalization, improve where necessary.
    response.body.map(item => {
      let normalizedEntity = item.entity;
      if (item.type === 'notebook') {
        normalizedEntity = dataProcessors.notebookData(item.entity);
      }
      if (item.type === 'lesson') {
        normalizedEntity = dataProcessors.lessonData(item.entity);
      }
      if (item.type === 'paragraph_comment') {
        normalizedEntity = dataProcessors.processComment(item.entity);
      }
      if (item.type === 'media_resource') {
        normalizedEntity = dataProcessors.resourceData(item.entity);
      }

      return {
        ...item, entity: normalizedEntity,
      };
    })
  ));

  // Add saga cancellation handler to the promise. It aborts the backend
  // request if a new one kicks in.
  promise[CANCEL] = () => { req.abort(); };

  return promise;
};
