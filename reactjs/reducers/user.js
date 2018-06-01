export default (state = { uid: 0, sessionToken: null }, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        uid: action.uid,
        sessionToken: action.sessionToken,
      };

    case 'USER_UPDATE_SESSION_TOKEN':
      return {
        ...state,
        sessionToken: action.sessionToken,
      };

    default:
      return state;
  }
};
