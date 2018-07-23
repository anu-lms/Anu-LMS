/**
 * Returns the first unread comment from the given list.
 */
export const getFirstUnreadCommentId = comments => {
  for (let rootComment of comments) { // eslint-disable-line no-restricted-syntax
    if (!rootComment.isRead) {
      return rootComment.id;
    }

    for (let comment of rootComment.children) { // eslint-disable-line no-restricted-syntax
      if (!comment.isRead) {
        return comment.id;
      }
    }
  }

  return null;
};
