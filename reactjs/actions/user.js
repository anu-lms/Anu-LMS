export function login(uid) {
  return {
    type: 'USER_LOGIN',
    uid,
  };
}
