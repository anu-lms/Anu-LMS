export function login(user) {
  return {
    type: 'USER_LOGIN',
    user,
  };
}

export function setOrganization(organizationId) {
  return {
    type: 'USER_SET_ORGANIZATION',
    organizationId,
  };
}
