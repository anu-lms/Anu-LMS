export default (state = { data: {}, activeOrganization: null }, action) => {
  switch (action.type) {
    case 'USER_LOGIN': {
      return {
        ...state,
        data: action.user,
        activeOrganization: action.user.organization[0] ? action.user.organization[0].id : null,
      };
    }

    default:
      return state;
  }
};
