import * as dataProcessors from '../utils/dataProcessors';

/**
 * Returns normalized search item object.
 */
export const normalizeSearchItem = item => {
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
