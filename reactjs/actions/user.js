/**
 * Let applications store know that user is logged in.
 *
 * @param user
 *   User object to log in.
 */
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

/**
 * Set active organization for current user.
 *
 * @param organizationId
 *   An id of organization to set as active.
 */
export function setOrganization(organizationId) {
  return {
    type: 'USER_SET_ORGANIZATION',
    organizationId,
  };
}
