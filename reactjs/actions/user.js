export function login(uid, sessionToken) {
  return {
    type: 'USER_LOGIN',
    uid,
    sessionToken,
  };
}

export function updateSessionToken(sessionToken) {
  return {
    type: 'USER_UPDATE_SESSION_TOKEN',
    sessionToken,
  };
}
