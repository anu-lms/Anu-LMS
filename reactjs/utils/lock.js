import { store } from '../store/store';
import * as lockActions from '../actions/lock';

// Add a new lock into lock collection.
export const add = collectionName => {
  // Reserve lock id for this lock.
  const lockId = store.getState().lock.currentIndex + 1;
  // Add a lock.
  store.dispatch(lockActions.lockAdd(collectionName, lockId));

  return lockId;
};

// Remove the lock.
export const release = lockId => {
  store.dispatch(lockActions.lockRemove(lockId));
};


// Check if there are any locks at all.
export const isLocked = () => {
  // Get current state from Redux.
  const locks = store.getState().lock.locks; // eslint-disable-line prefer-destructuring
  return !!locks.length;
};

// Check if there are locks in the collection.
export const isNameLocked = collectionName => {
  // Get current state from Redux.
  const locks = store.getState().lock.locks; // eslint-disable-line prefer-destructuring
  // Find first lock with matching collection name.
  const index = locks.findIndex(el => el.collection === collectionName);

  return index !== -1;
};

// TODO: implement timeout option.
// Wait for all locks in a given collection to be released.
export const wait = collectionName => new Promise(resolve => {
  (function waitForLocksToRelease() { // eslint-disable-line consistent-return
    // Get current state from Redux.
    const locks = store.getState().lock.locks; // eslint-disable-line prefer-destructuring
    // Find first lock with matching collection name.
    const index = locks.findIndex(el => el.collection === collectionName);

    if (index === -1) {
      // No locks in given collection found.
      return resolve();
    }

    setTimeout(waitForLocksToRelease, 100);
  }());
});

// TODO: implement timeout option.
// Wait for all locks to be released.
export const waitAll = () => new Promise(resolve => {
  (function waitForLocksToRelease() { // eslint-disable-line consistent-return
    // Get locks array from Redux.
    const locks = store.getState().lock.locks; // eslint-disable-line prefer-destructuring
    if (locks.length > 0) {
      setTimeout(waitForLocksToRelease, 100);
    }
    else {
      return resolve();
    }
  }());
});
