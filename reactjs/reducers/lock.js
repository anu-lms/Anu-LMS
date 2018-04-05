export default (state = {
  // Cursor for incremental id for every new lock.
  currentIndex: 0,
  locks: [],
}, action) => {
  switch (action.type) {
    case 'LOCK_ADD': {
      // Increment lock id.
      const lockIndex = state.currentIndex + 1;

      return {
        currentIndex: lockIndex,
        locks: [
          ...state.locks,
          { id: lockIndex, collection: action.name },
        ],
      };
    }

    case 'LOCK_REMOVE': {
      // Find the lock and its collection.
      const index = state.locks.findIndex(el => el.id === action.id);

      // Lock not found.
      if (index === -1) {
        return state;
      }

      return {
        ...state,
        locks: [
          ...state.locks.slice(0, index),
          ...state.locks.slice(index + 1),
        ],
      };
    }

    default:
      return state;
  }
};
