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

// Remove lock from lock commection.
export const release = (collection_name, lock_id) => {
  store.dispatch(lockActions.lockRemove(collection_name, lock_id));
}

// Wait for all locks in collection to be released.
export const wait = collection_name => {
  return new Promise(function (resolve, reject) {
    (function waitForLocksToRelease() {
      // Get current state from Redux.
      const lockState = store.getState().lock;
      const lockCollection = lockState[collection_name] ? lockState[collection_name] : [];
      if (lockCollection.length > 0) {
        setTimeout(waitForLocksToRelease, 100);
      }
      else {
        return resolve();
      }
    })();
  });
}