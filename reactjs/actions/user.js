export function login(user) {
  return {
    type: 'USER_LOGIN',
    user,
  };
}
