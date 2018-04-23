export const open = (activeTab = 'notes') => ({
  type: 'LESSON_SIDEBAR_OPEN',
  activeTab,
});

export const close = () => ({
  type: 'LESSON_SIDEBAR_CLOSE',
});

/**
 * Set sidebar state to "Is Loading".
 */
export const setStateLoading = () => ({
  type: 'LESSON_SIDEBAR_UPDATE_LOADING_STATE',
  isLoading: true,
});

/**
 * Set sidebar state to "Is Loaded".
 */
export const setStateLoaded = () => ({
  type: 'LESSON_SIDEBAR_UPDATE_LOADING_STATE',
  isLoading: false,
});

export const setActiveParagraph = paragraphId => ({
  type: 'LESSON_COMMENTS_SET_ACTIVE_PARAGRAPH',
  paragraphId,
});
