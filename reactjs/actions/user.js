export function login(uid, uuid) {
  return {
    type: 'USER_LOGIN',
    uid,
    uuid,
  };
}
