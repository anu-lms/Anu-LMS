/**
 * Make request to the backend to search results.
 */
export const fetch = () => ({
  type: 'SEARCH_REQUESTED',
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
