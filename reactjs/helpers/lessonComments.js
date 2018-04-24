export const getOrderedComments = (comments) => {
  const threadedComments = getThreadedCommentsList(comments);
  threadedComments.forEach((element) => {
    element.children.sort((a, b) => (a.created < b.created));
  });
  return threadedComments.sort((a, b) => (a.created > b.created));
};

export const getCommentById = (comments, id) => {
  return comments.findIndex(comment => comment.id === id);
};

function getThreadedCommentsList(comments) {
  const tree = [];
  const rootOf = {};
  const processed = [];

  const findRootId = (item) => {
    if (item.parentId) {
      const parentIndex = getCommentById(comments, item.parentId);
      const parent = comments[parentIndex];

      const rootId = findRootId(parent);

      item['parent'] = {
        id: parent.id,
        author: parent.author,
      };

      rootOf[rootId] = rootOf[rootId] || [];
      rootOf[rootId].push(item);
      processed.push(item.id);

      return rootId;
    }

    return item.id;
  };

  for (let i = 0, length = comments.length; i < length; i++) {
    const item = comments[i];
    if (processed.indexOf(item.id) > -1) {
      continue;
    }

    if (!item.parentId) {
      rootOf[item.id] = rootOf[item.id] || [];
      item['children'] = rootOf[item.id] || [];
      tree.push(item);
    }
    else {
      findRootId(item);
    }
  }

  return tree;
}
