export default (state = { uid: 0 }, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        uid: action.uid,
      };

    default:
      return state;
  }
};
