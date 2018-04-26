import * as dataProcessors from '../utils/dataProcessors';

/**
 * First time save the note on the backend.
 */
export const insertComment = (request, userId, paragraphId, organizationId, text = '', parentId) => new Promise((resolve, reject) => {
  request
    .post('/jsonapi/paragraph_comment/paragraph_comment')
    .query({
      'include': 'uid, field_comment_parent',
    })
    .send({
      data: {
        type: 'paragraph_comment--paragraph_comment',
        attributes: {
          uid: userId,
          field_comment_paragraph: paragraphId,
          field_comment_organization: organizationId,
          field_comment_text: {
            value: text,
            format: 'filtered_html',
          },
          field_comment_parent: parentId,
        },
      },
    })
    .then(response => {
      const comments = dataProcessors.processCommentsList([response.body.data]);
      resolve(comments[0]);
    })
    .catch(error => {
      console.log('Could not save the comment.', error);
      reject(error);
    });
});
