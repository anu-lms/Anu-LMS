//import { html } from '../components/atoms/RichEditor/serializer';
import _cloneDeep from 'lodash/cloneDeep';

export default (state = [], action) => {

  // TODO: Remove.
  //console.log('action');
  //console.log(action);

  let index, existingNote;

  switch (action.type) {
    case 'NOTE_ADD':
      const { note } = action;

      // Search for the existing note.
      index = state.findIndex(element => element.id === note.id);

      // If the note was found, then we should update it.
      if (index !== -1) {
        existingNote = state[index];
        existingNote.data = note;
        //existingNote.data.bodyRaw = html.deserialize(note.body);

        return [
          ...state.slice(0, index),
          _cloneDeep(existingNote),
          ...state.slice(index + 1)
        ];
      }

      // Search for the note with 0 id. It's the new entity. If we try to
      // insert the new note, then note with 0 id should be replaced with this
      // one.
      // TODO: Separate saveNew handler.
      /*index = state.findIndex(element => element.id === 0);
      if (index !== -1) {
        return [
          ...state.slice(0, index),
          {
            id: note.id,
            data: {
              ...note,
              bodyRaw: html.deserialize(note.body),
            },
          },
          ...state.slice(index + 1)
        ];
      }*/

      // If lesson didn't exist before - simply add it.
      return [
        ...state,
        {
          id: note.id,
          data: {
            ...note,
           // bodyRaw: html.deserialize(note.body),
          },
        }
      ];

    case 'NOTE_UPDATE_TITLE':

      // Search for the existing note.
      index = state.findIndex(element => element.id === action.id);

      // If the note is found (which is expected), then just update the title.
      if (index !== -1) {
        state[index].data.title = action.title;
        return [
          ...state.slice(0, index),
          _cloneDeep(state[index]),
          ...state.slice(index + 1)
        ];
      }

      // If note was not found (which is not expected, but just as a fallback)
      // then simply return state as is.
      return [
        ...state
      ];

    case 'NOTE_UPDATE_BODY':

      // Search for the existing note.
      index = state.findIndex(element => element.id === action.id);

      // If the note is found (which is expected), then just update the title.
      if (index !== -1) {

       // state[index].data.bodyRaw = action.bodyRaw;

        state[index].data.body = action.body;

        return [
          ...state.slice(0, index),
          _cloneDeep(state[index]),
          ...state.slice(index + 1)
        ];
      }

      // If note was not found (which is not expected, but just as a fallback)
      // then simply return state as is.
      return [
        ...state
      ];

    case 'NOTEBOOK_CLEAR':

      // We should clear all notes apart from unsaved one.
      index = state.findIndex(element => element.id === 0);
      if (index !== -1) {
        return [
          _cloneDeep(state[index])
        ];
      }

      return [];

    default:
      return state;
  }
};
