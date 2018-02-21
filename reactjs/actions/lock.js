export const lockAdd = (name, id) => ({
  type: 'LOCK_ADD',
  name,
  id
});

export const lockRemove = (name, id) => ({
  type: 'LOCK_REMOVE',
  name,
  id
});
