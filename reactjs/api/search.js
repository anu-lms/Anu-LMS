
import * as dataProcessors from '../utils/dataProcessors';

/**
 * Returns normalized search item object.
 */
const normalizeSearchItem = item => {
  switch (item.type) {
    case 'notebook':
      return dataProcessors.notebookData(item.entity);
    case 'lesson':
      return dataProcessors.lessonData(item.entity);
    case 'paragraph_comment':
      return dataProcessors.processComment(item.entity);
    case 'media_resource':
      return dataProcessors.resourceData(item.entity);
    default:
      return item.entity;
  }
};

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
        entity: normalizeSearchItem(item),
      }));

      resolve(items);
    })
    .catch(error => {
      console.log('Could not fetch search results.', error);
      reject(error);
    });
});
