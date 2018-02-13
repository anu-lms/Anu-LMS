import striptags from 'striptags';
import * as dataProcessors from '../utils/dataProcessors';

export const getTeaser = body => {
  const maxTeaserLength = 256;

  // Set max length for the text.
  let teaser = body;
  if (teaser.length > maxTeaserLength) {
    teaser = teaser.substring(0, maxTeaserLength);
  }

  // Strip all tags apart from paragraph without replacement.
  teaser = striptags(teaser, ['p']);

  // Paragraph replacement should be empty space.
  teaser = striptags(teaser, [], ' ');

  // Replace html representation of quotes.
  teaser = teaser.replace(new RegExp("&"+"#"+"x27;", "g"), "'");

  return teaser.trim();
};

/**
 * Get state of note sync with backend.
 */
export const getSavedState = note => {
  // Default state if nothing else is stated.
  let state = 'Saved';
  if (typeof note.isSaving !== 'undefined' && note.isSaving) {
    state = 'Saving...';
  }
  else if (typeof note.isSaved !== 'undefined') {
    state = note.isSaved ? 'Saved' : 'Not saved';
  }
  return state;
};

/**
 * First time save the note.
 */
export const createNote = (request, title = '', body = '') => {
  return new Promise((resolve, reject) => {
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
          }
        }
      })
      .then(response => {
        const notes = dataProcessors.notebookData([response.body.data]);
        resolve(notes[0]);
      })
      .catch(error => {
        console.log('Could not save the note. Error:');
        console.log(error);
        reject(error);
      });
  });
};

/**
 * Update the existing note.
 */
export const updateNote = (request, title, body, uuid) => {
  return new Promise((resolve, reject) => {
    request
      .patch('/jsonapi/notebook/notebook/' + uuid)
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
          }
        }
      })
      .then(response => {
        const notes = dataProcessors.notebookData([response.body.data]);
        resolve(notes[0]);
      })
      .catch(error => {
        console.log('Could not update the note. Error:');
        console.log(error);
        reject(error);
      });
  });
};
