
/**
 * Returns object by given id.
 */
export const getObjectById = (items, id) => {
  const index = items.findIndex(item => item.id === id);
  return index !== -1 ? items[index] : null;
};
