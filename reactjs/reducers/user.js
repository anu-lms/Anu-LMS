export default (state = { data: {}, activeOrganization: null }, action) => {
  switch (action.type) {
    case 'USER_LOGIN': {
      return {
        ...state,
        data: action.user,
        activeOrganization: action.user.organization[0] ? action.user.organization[0].id : null,
      };
    }
    case 'USER_UPDATE_DATA_IN_STORE': {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.userData,
        },
      };
    }
    case 'USER_SET_ORGANIZATION': {
      return {
        ...state,
        activeOrganization: action.organizationId,
      };
    }

    default:
      return state;
  }
};
