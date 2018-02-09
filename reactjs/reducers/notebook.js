
export default (state = {}, action) => {

  switch (action.type) {
    case 'ADD_NOTE':
      const { note } = action;

      return {
        ...state,
        [note.id]: note
      };

    default:
      return state;
  }
};