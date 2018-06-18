/**
 * Opens the overlay.
 */
export const open = (id = '', content = null, header = null, onClose = () => {}, isLoading = false) => ({
  type: 'OVERLAY_OPEN',
  id,
  content,
  header,
  onClose,
  isLoading,
});

/**
 * Closes the overlay.
 */
export const close = () => ({
  type: 'OVERLAY_CLOSE',
});

/**
 * Sets overlay state as loading content.
 */
export const loading = () => ({
  type: 'OVERLAY_IS_LOADING',
});

/**
 * Sets overlay state is loaded content.
 */
export const loaded = () => ({
  type: 'OVERLAY_IS_LOADED',
});

/**
 * Reports error within the overlay.
 */
export const error = (message = 'Error occurred.') => ({
  type: 'OVERLAY_IS_ERROR',
  message,
});
