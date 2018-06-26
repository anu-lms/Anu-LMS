export default (state = { data: {}, activeOrganization: null }, action) => {
  switch (action.type) {
    case 'USER_LOGIN': {
      if (action.user.organization) {

      }

      return {
        ...state,
        data: action.user,
        // activeOrganization: action.activeOrganization,
      };
    }

    default:
      return state;
  }
};
