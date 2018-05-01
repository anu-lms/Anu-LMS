import * as dataProcessors from '../utils/dataProcessors';

/**
 * Make a request to the backend to add new paragraph_comment entity.
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

/**
 * Make a request to the backend to update paragraph_comment entity.
 */
export const updateComment = (request, uuid, params) => new Promise((resolve, reject) => {
  const sendParams = {};
  if (params.hasOwnProperty('text')) {
    sendParams.field_comment_text = {
      value: params.text,
      format: 'filtered_html',
    };
  }
  if (params.hasOwnProperty('deleted')) {
    sendParams.field_comment_deleted = params.deleted;
  }

  request
    .patch(`/jsonapi/paragraph_comment/paragraph_comment/${uuid}`)
    .query({
      'include': 'uid, field_comment_parent',
    })
    .send({
      data: {
        type: 'paragraph_comment--paragraph_comment',
        id: uuid,
        attributes: sendParams,
      },
    })
    .then(response => {
      const comments = dataProcessors.processCommentsList([response.body.data]);
      resolve(comments[0]);
    })
    .catch(error => {
      console.log('Could not update a comment.', error);
      reject(error);
    });
});

/**
 * Make a request to the backend to delete paragraph_comment entity.
 */
export const deleteComment = (request, uuid) => new Promise((resolve, reject) => {
  request
    .delete(`/jsonapi/paragraph_comment/paragraph_comment/${uuid}`)
    .send()
    .then(() => {
      resolve();
    })
    .catch(error => {
      console.log('Could not delete a comment.', error);
      reject(error);
    });
});
