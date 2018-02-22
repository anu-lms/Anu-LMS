export const lockAdd = (name, id) => ({
  type: 'LOCK_ADD',
  name,
  id
});

export const lockRemove = id => ({
  type: 'LOCK_REMOVE',
  id
});
