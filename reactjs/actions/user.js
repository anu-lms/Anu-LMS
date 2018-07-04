export function login(user) {
  return {
    type: 'USER_LOGIN',
    user,
  };
}

export function update(userData) {
  return {
    type: 'USER_UPDATE_DATA_IN_STORE',
    userData,
  };
}

export function setOrganization(organizationId) {
  return {
    type: 'USER_SET_ORGANIZATION',
    organizationId,
  };
}
