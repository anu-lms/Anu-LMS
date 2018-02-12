export default (state = { notes: [], activeNoteId: -1 }, action) => {
  let index;

  switch (action.type) {

    // Adds existing note to the notebook store.
    case 'NOTE_ADD':

      // Search for the existing note.
      index = state.notes.findIndex(element => element.id === action.note.id);

      // If the note was found, then we should update it.
      if (index !== -1) {
        return {
          ...state,
          notes: [
            ...state.notes.slice(0, index),
            action.note,
            ...state.notes.slice(index + 1)
          ],
        };
      }

      // If lesson didn't exist before - simply add it.
      return {
        ...state,
        notes: [
          ...state.notes,
          action.note,
        ],
      };

    case 'NOTE_UPDATE_TITLE':

      // Search for the existing note.
      index = state.notes.findIndex(element => element.id === action.id);

      // If the note is found (which is expected), then just update the title.
      if (index !== -1) {
        return {
          ...state,
          notes: [
            ...state.notes.slice(0, index),
            {
              ...state.notes[index],
              title: action.title,
            },
            ...state.notes.slice(index + 1),
          ],
        }
      }

      // If note was not found (which is not expected, but just as a fallback)
      // then simply return state as is.
      return state;

    case 'NOTE_UPDATE_BODY':

      // Search for the existing note.
      index = state.notes.findIndex(element => element.id === action.id);

      // If the note is found (which is expected), then just update the body.
      if (index !== -1) {
        return {
          ...state,
          notes: [
            ...state.notes.slice(0, index),
            {
              ...state.notes[index],
              body: action.body,
            },
            ...state.notes.slice(index + 1),
          ],
        }
      }

      // If note was not found (which is not expected, but just as a fallback)
      // then simply return state as is.
      return state;

    // Set ID of active note to display for editing.
    case 'NOTE_SET_ACTIVE':
      return {
        ...state,
        activeNoteId: action.id,
      };

    // Return to the initial state.
    case 'NOTEBOOK_CLEAR':
      return {
        ...state,
        notes: [],
        activeNoteId: -1,
      };

    default:
      return state;
  }
};
