
import * as dataProcessors from '../utils/dataProcessors';

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
      // @todo: an example of normalization, improve where necessary.
      const items = response.body.map(item => {
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
          ...item,
          entity: normalizedEntity,
        };
      });

      resolve(items);
    })
    .catch(error => {
      console.log('Could not fetch search results.', error);
      reject(error);
    });
});
