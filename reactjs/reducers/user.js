export default (state = { uid: 0, uuid: '' }, action) => {
  switch (action.type) {
    case 'USER_LOGIN':
      return {
        ...state,
        uid: action.uid,
        uuid: action.uuid,
      };

    default:
      return state;
  }
};
