import * as dataProcessors from '../utils/dataProcessors';

/**
 * Make a request to the backend to fetch comment entities.
 */
export const fetchComments = (request, paragraphId, organizationId = null) => new Promise((resolve, reject) => { // eslint-disable-line max-len
  const query = {
    'include': 'uid, field_comment_parent, field_comment_organization, field_comment_mentions',
    // Filter by paragraph id.
    'filter[field_comment_paragraph][value]': paragraphId,
    // Filter comments by organization.
    'filter[field_comment_organization][condition][path]': 'field_comment_organization',
  };

  if (organizationId) {
    // User should see comments only from users within same organization.
    query['filter[field_comment_organization][condition][value]'] = organizationId;
  }
  else {
    // If user isn't assigned to any organization,
    // he should see comments from users without organization as well.
    query['filter[field_comment_organization][condition][operator]'] = 'IS NULL';
  }

  request
    .get('/jsonapi/paragraph_comment/paragraph_comment')
    .query(query)
    .then(response => {
      // Normalize Comment objects.
      const comments = response.body.data.map(comment => dataProcessors.processComment(comment));
      resolve(comments);
    })
    .catch(error => {
      console.error('Could not fetch list of comments.', error);
      reject(error);
    });
});

/**
 * Make a request to the backend to add new paragraph_comment entity.
 */
export const insertComment = (request, userId, paragraphId, organizationId, text = '', parentId) => new Promise((resolve, reject) => {
  request
    .post('/jsonapi/paragraph_comment/paragraph_comment')
    .query({
      'include': 'uid, field_comment_parent, field_comment_organization',
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
      const comment = dataProcessors.processComment(response.body.data);
      resolve(comment);
    })
    .catch(error => {
      console.error('Could not save the comment.', error);
      reject(error);
    });
});

/**
 * Make a request to the backend to update paragraph_comment entity.
 */
export const updateComment = (request, uuid, params) => new Promise((resolve, reject) => {
  const sendParams = {};
  if (Object.prototype.hasOwnProperty.call(params, 'text')) {
    sendParams.field_comment_text = {
      value: params.text,
      format: 'filtered_html',
    };
  }
  if (Object.prototype.hasOwnProperty.call(params, 'deleted')) {
    sendParams.field_comment_deleted = params.deleted;
  }

  request
    .patch(`/jsonapi/paragraph_comment/paragraph_comment/${uuid}`)
    .query({
      'include': 'uid, field_comment_parent, field_comment_organization',
    })
    .send({
      data: {
        type: 'paragraph_comment--paragraph_comment',
        id: uuid,
        attributes: sendParams,
      },
    })
    .then(response => {
      const comment = dataProcessors.processComment(response.body.data);
      resolve(comment);
    })
    .catch(error => {
      console.error('Could not update a comment.', error);
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
      console.error('Could not delete a comment.', error);
      reject(error);
    });
});

/**
 * Make a request to the backend to mark list of comments as read.
 */
export const markCommentsAsRead = (request, commentIds) => new Promise((resolve, reject) => {
  request
    .post('/comments/mark-as-read')
    .query({ '_format': 'json' })
    .set('Content-Type', 'application/json')
    .send({
      comment_ids: commentIds,
    })
    .then(response => {
      resolve(response.body);
    })
    .catch(error => {
      console.log('Could not mark comments as read.', error);
      reject(error);
    });
});
