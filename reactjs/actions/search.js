/**
 * Make request to the backend to search results.
 */
export const fetch = text => ({
  type: 'SEARCH_REQUESTED',
  text,
});

/**
 * Request to the backend to get search results failed.
 */
export const fetchFailed = error => ({
  type: 'SEARCH_REQUEST_FAILED',
  error,
});

/**
 * Save received from backend search results to the application store.
 */
export const received = results => ({
  type: 'SEARCH_RECEIVED',
  results,
});

/**
 * Flush search results.
 */
export const clear = () => ({
  type: 'SEARCH_CLEAR',
});
