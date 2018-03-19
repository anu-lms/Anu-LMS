import striptags from 'striptags';
import * as dataProcessors from '../utils/dataProcessors';

export const getTeaser = (body, rowNumber) => {
  const maxTeaserLength = 256;

  // Set max length for the text.
  let teaser = body;
  if (teaser.length > maxTeaserLength) {
    teaser = teaser.substring(0, maxTeaserLength);
  }

  // Strip all tags apart from paragraph without replacement.
  teaser = striptags(teaser, ['p']);

  let rows = [];
  teaser.split('</p>').forEach(line => {

    if (rows.length === rowNumber) {
      return;
    }

    const plainLine = striptags(line.trim());
    if (plainLine.length > 0) {
      rows.push(plainLine);
    }
  });

  return rows.length === rowNumber ? rows[rowNumber - 1] : '';
};

/**
 * Returns note object by id
 */
export const getNoteById = (notes, noteId) => {
  const index = notes.findIndex(note => note.id === noteId);
  if (index !== -1 ) {
    return notes[index];
  }
  return null;
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
 * Returns an array of notes which are not yet synced with backend.
 */
export const getUnsavedNotes = notes => {
  return notes.filter(note => {
    const isSaved = typeof note.isSaved !== 'undefined' && note.isSaved === true;
    const isSaving = typeof note.isSaving !== 'undefined' && note.isSaving === true;
    return !isSaved && !isSaving;
  });
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
