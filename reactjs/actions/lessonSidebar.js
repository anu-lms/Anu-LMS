export const open = (activeTab) => ({
  type: 'LESSON_SIDEBAR_OPEN',
  activeTab: activeTab,
});

export const close = () => ({
  type: 'LESSON_SIDEBAR_CLOSE',
});

export const setActiveParagraph = paragraphId => ({
  type: 'LESSON_COMMENTS_SET_ACTIVE_PARAGRAPH',
  paragraphId,
});
