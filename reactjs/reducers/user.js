export default (state = {}, action) => {

  switch (action.type) {
    case 'USER_SET':
      return {
        uid: action.user.uid,
        uuid: action.user.uuid,
      };

    default:
      return state;
  }
};
