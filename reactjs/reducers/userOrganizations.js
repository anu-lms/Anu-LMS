const initialState = {
  activeOrganization: null,
  organizations: [],
  expires: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'ORGANIZATIONS_SET_ACTIVE':
      return {
        ...state,
        activeOrganization: action.organizationId,
      };

    // Adds given comment to the store.
    case 'ORGANIZATIONS_ADD_TO_STORE': {
      const expiresInMins = 5;

      return {
        ...state,
        organizations: action.organizations,
        expires: new Date().getTime() + (expiresInMins * 1000),
      };
    }

    case 'ORGANIZATIONS_FETCH_ERROR':
      return initialState;

    default:
      return state;
  }
};
