/**
 * Returns progress for the lesson. @todo
 */
export const getFirstUnreadCommentId = comments => {
  for (let rootComment of comments) {
    if (!rootComment.isRead) {
      return rootComment.id;
    }

    for (let comment of rootComment.children) {
      if (!comment.isRead) {
        return comment.id;
      }
    }
  }

  return null;
};
