import striptags from 'striptags';

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
