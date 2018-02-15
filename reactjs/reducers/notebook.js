export default (state = {
  // List of all notes.
  notes: [],
  // ID of note which is currently being edited.
  activeNoteId: -1,
  // Defines if notes list or note edit is visible on mobile.
  isMobileContentVisible: false
}, action) => {
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
            {
              ...action.note,
              isSaved: true,
              isSaving: false,
            },
            ...state.notes.slice(index + 1)
          ],
        };
      }

      // If lesson didn't exist before - simply add it.
      return {
        ...state,
        notes: [
          ...state.notes,
          {
            ...action.note,
            isSaved: true,
            isSaving: false,
          },
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
              // Automatically mark note as not synced with backend.
              isSaved: false,
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

        // There is only 1 case when we want to mark a note as saved on body
        // change: when current note body is empty. It can happen only when the
        // note was loaded from the backend. It would be '<p></p>' otherwise.
        let isSaved = false;
        if (!state.notes[index].body) {
          isSaved = true;
        }

        return {
          ...state,
          notes: [
            ...state.notes.slice(0, index),
            {
              ...state.notes[index],
              body: action.body,
              isSaved: isSaved,
            },
            ...state.notes.slice(index + 1),
          ],
        }
      }

      // If note was not found (which is not expected, but just as a fallback)
      // then simply return state as is.
      return state;

    case 'NOTE_SET_STATE_SAVING':

      // Search for the existing note.
      index = state.notes.findIndex(element => element.id === action.id);

      // If the note is found (which is expected), then just set the right state.
      if (index !== -1) {
        return {
          ...state,
          notes: [
            ...state.notes.slice(0, index),
            {
              ...state.notes[index],
              isSaving: true,
              isSaved: false,
            },
            ...state.notes.slice(index + 1),
          ],
        }
      }

      // Otherwise return unchanged state.
      return state;

    case 'NOTE_SET_STATE_SAVED':

      // Search for the existing note.
      index = state.notes.findIndex(element => element.id === action.id);

      // If the note is found (which is expected), then just set the right state.
      if (index !== -1) {
        return {
          ...state,
          notes: [
            ...state.notes.slice(0, index),
            {
              ...state.notes[index],
              isSaving: false,
              isSaved: true,
            },
            ...state.notes.slice(index + 1),
          ],
        }
      }

      // Otherwise return unchanged state.
      return state;

    case 'NOTE_SET_STATE_NOT_SAVED':

      // Search for the existing note.
      index = state.notes.findIndex(element => element.id === action.id);

      // If the note is found (which is expected), then just set the right state.
      if (index !== -1) {
        return {
          ...state,
          notes: [
            ...state.notes.slice(0, index),
            {
              ...state.notes[index],
              isSaving: false,
              isSaved: false,
            },
            ...state.notes.slice(index + 1),
          ],
        }
      }

      // Otherwise return unchanged state.
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
        notes: [],
        activeNoteId: -1,
        isMobileContentVisible: false,
      };

    // Show notes list or note edit form on the mobile.
    // This action toggles this behavior.
    case 'NOTEBOOK_MOBILE_TOGGLE_VISIBILITY':
      return {
        ...state,
        isMobileContentVisible: !state.isMobileContentVisible,
      };

    case 'NOTE_DELETE':
      // Search for the existing note.
      index = state.notes.findIndex(element => element.id === action.id);

      // If the note is found (which is expected), then delete this note from state
      // and set new active note.
      const activeNoteIndex = state.notes.length > (index + 1) ? (index + 1) : (index - 1);
      if (index !== -1) {
        return {
          ...state,
          notes: [
            ...state.notes.slice(0, index),
            ...state.notes.slice(index + 1)
          ],
          activeNoteId: state.notes[activeNoteIndex].id,
        }
      }

    default:
      return state;
  }
};
