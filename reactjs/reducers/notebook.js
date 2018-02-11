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

    case 'NOTE_ADD_NEW':

      // Do not add a new note there is already existing one which is not
      // yet saved.
      index = state.notes.findIndex(note => note.id === 0);
      if (index !== -1) {
        console.log('The unsaved note already exist, so not adding a new one.');
        return state;
      }

      return {
        ...state,
        notes: [
          ...state.notes,
          {
            id: 0,
            uuid: '',
            title: action.title,
            body: action.body,
            created: Math.floor(Date.now() / 1000),
            changed: Math.floor(Date.now() / 1000),
          }
        ],
        activeNoteId: 0,
      };

    case 'NOTE_REPLACE_NEW':

      // Find unsaved note in the notebook and replace it with saved note.
      // It happens when unsaved note was saved the first time.
      index = state.notes.findIndex(note => note.id === 0);
      if (index !== -1) {
        return {
          ...state,
          notes: [
            ...state.notes.slice(0, index),
            ...state.notes.slice(index + 1),
            action.note,
          ],
        }
      }

      // If unsaved note was not found then do nothing.
      return state;

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

    case 'NOTEBOOK_CLEAR':

      // We should clear all notes apart from unsaved one.
      index = state.notes.findIndex(element => element.id === 0);
      if (index !== -1) {
        return {
          notes: [{ ...state.notes[index] }],
          activeNoteId: 0, // Automatically set active note to unsaved note.
        }
      }

      // If no unsaved note - then return to the initial state.
      return {
        ...state,
        notes: [],
      };

    default:
      return state;
  }
};
