export const open = (activeTab = 'notes', context = '') => ({
  type: 'LESSON_SIDEBAR_OPEN',
  activeTab,
  context,
});

export const close = () => ({
  type: 'LESSON_SIDEBAR_CLOSE',
});

/**
 * Set sidebar state to "Is Loading".
 */
export const setLoadingState = () => ({
  type: 'LESSON_SIDEBAR_SET_LOADING_STATE',
});

/**
 * Set sidebar state to "Is Loaded".
 */
export const removeLoadingState = () => ({
  type: 'LESSON_SIDEBAR_REMOVE_LOADING_STATE',
});
