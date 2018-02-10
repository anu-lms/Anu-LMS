export default (state = [], action) => {

  console.log('action');
  console.log(action);

  let index, existingNote;

  switch (action.type) {
    case 'ADD_NOTE':
      const { note } = action;

      // Search for the existing note.
      index = state.findIndex(element => element.id === note.id);

      // If the note was found, then we should update it.
      if (index !== -1) {
        existingNote = state[index];
        existingNote.data = note;
        return [
          ...state.slice(0, index),
          existingNote,
          ...state.slice(index + 1)
        ];
      }

      // If lesson didn't exist before - simply add it.
      return [
        ...state,
        {
          id: note.id,
          data: note,
        }
      ];

    default:
      return state;
  }
};
