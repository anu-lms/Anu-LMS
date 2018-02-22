import { store } from '../store/store';
import * as lockActions from '../actions/lock';

// Add a new lock into lock collection.
export const add = (collection_name) => {
  // Reserve lock id for this lock.
  const lock_id = store.getState().lock.currentIndex + 1;
  // Add a lock.
  store.dispatch(lockActions.lockAdd(collection_name, lock_id));

  return lock_id;
}

// Remove the lock.
export const release = (lock_id) => {
  store.dispatch(lockActions.lockRemove(lock_id));
}


// Check if there are any locks at all.
export const isLocked = () => {
  // Get current state from Redux.
  const locks = store.getState().lock.locks;
  return !!locks.length;
}

// Check if there are locks in the collection.
export const isNameLocked = collection_name => {
  // Get current state from Redux.
  const locks = store.getState().lock.locks;
  // Find first lock with matching collection name.
  const index = locks.findIndex(el => el.collection === collection_name);

  return index === -1 ? false : true;
}

// Wait for all locks in a given collection to be released.
export const wait = collection_name => {
  return new Promise(function (resolve, reject) {
    (function waitForLocksToRelease() {
      // Get current state from Redux.
      const locks = store.getState().lock.locks;
      // Find first lock with matching collection name.
      const index = locks.findIndex(el => el.collection === collection_name);

      if (index === -1) {
        // No locks in given collection found.
        return resolve();
      }
      else {
        setTimeout(waitForLocksToRelease, 100);
      }

    })();
  });
}

// Wait for all locks to be released.
export const waitAll = () => {
  return new Promise(function (resolve, reject) {
    (function waitForLocksToRelease() {
      // Get locks array from Redux.
      console.log(store.getState());
      const locks = store.getState().lock.locks;
      if (locks.length > 0) {
        setTimeout(waitForLocksToRelease, 100);
      }
      else {
        return resolve();
      }
    })();
  });
}