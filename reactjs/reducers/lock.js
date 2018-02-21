export default (state = {
  // Cursor for incremental id for every new lock.
  currentIndex: 0
}, action) => {

  const lockCollection = state[action.name] ? state[action.name] : [];

  switch (action.type) {

    case 'LOCK_ADD':
      // Increment lock id.
      const lockIndex = state.currentIndex + 1;

      return {
        currentIndex: lockIndex,
        [action.name]: [
          ...lockCollection,
          lockIndex
        ]
      };

    case 'LOCK_REMOVE':
      // Find the lock in the lock collection.
      const index = lockCollection.findIndex(el => el === action.id);

      // Lock not found.
      if (index === -1) {
        return state;
      }

      return {
        ...state,
        [action.name]: [
          ...lockCollection.slice(0, index),
          ...lockCollection.slice(index + 1)
        ]
      };

    default:
      return state;
  }
};
