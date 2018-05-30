import * as dataProcessors from '../utils/dataProcessors';

/**
 * First time save the note on the backend.
 */
export const createNote = (request, title = '', body = '') => new Promise((resolve, reject) => {
  request
    .post('/jsonapi/notebook/notebook')
    .send({
      data: {
        type: 'notebook--notebook',
        attributes: {
          field_notebook_title: title,
          field_notebook_body: {
            value: body,
            format: 'filtered_html',
          },
        },
      },
    })
    .then(response => {
      const notes = dataProcessors.notebookData([response.body.data]);
      resolve(notes[0]);
    })
    .catch(error => {
      console.log('Could not save the note. Error:', error);
      reject(error);
    });
});

/**
 * Update the existing note on the backend.
 */
export const updateNote = (request, title, body, uuid) => new Promise((resolve, reject) => {
  request
    .patch(`/jsonapi/notebook/notebook/${uuid}`)
    .send({
      data: {
        type: 'notebook--notebook',
        id: uuid,
        attributes: {
          field_notebook_title: title,
          field_notebook_body: {
            value: body,
            format: 'filtered_html',
          },
        },
      },
    })
    .then(response => {
      const notes = dataProcessors.notebookData([response.body.data]);
      resolve(notes[0]);
    })
    .catch(error => {
      console.log('Could not update the note. Error:', error);
      reject(error);
    });
});

/**
 * Remove the note from the backend.
 */
export const deleteNote = (request, uuid) => new Promise((resolve, reject) => {
  request
    .delete(`/jsonapi/notebook/notebook/${uuid}`)
    .send()
    .then(() => {
      resolve();
    })
    .catch(error => {
      console.log('Could not delete the note. Error:', error);
      reject(error);
    });
});
