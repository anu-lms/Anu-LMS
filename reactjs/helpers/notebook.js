import striptags from 'striptags';

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
  if (index !== -1) {
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
export const getUnsavedNotes = notes => notes.filter(note => {
  const isSaved = typeof note.isSaved !== 'undefined' && note.isSaved === true;
  const isSaving = typeof note.isSaving !== 'undefined' && note.isSaving === true;
  return !isSaved && !isSaving;
});

/**
 * Checks if the current note has no title & body.
 */
export const isEmptyNote = note => {
  const noTitle = note.title === '';
  const noBody = note.body === '<p></p>' || note.body === '';
  return noTitle && noBody;
};
