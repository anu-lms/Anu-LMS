/**
 * Make request to the backend to search results.
 */
export const fetch = (text, category = 'all') => ({
  type: 'SEARCH_REQUESTED',
  text,
  category,
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
 * Make request to the backend to fetch more results.
 */
export const loadMore = () => ({
  type: 'SEARCH_LOAD_MORE',
});

/**
 * Save received from backend search results to the application store.
 */
export const receivedMore = results => ({
  type: 'SEARCH_RECEIVED_MORE',
  results,
});

/**
 * Request to the backend to get search results failed.
 */
export const loadMoreFailed = error => ({
  type: 'SEARCH_REQUEST_MORE_FAILED',
  error,
});

/**
 * Flush search results.
 */
export const clear = () => ({
  type: 'SEARCH_CLEAR',
});
