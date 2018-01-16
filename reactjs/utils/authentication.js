/**
 * Checks current user auth status.
 */
export const isLogged = () => {
  const authData = {};// getAuthData();
  return authData && authData.accessToken;
};

/**
 * Saves OAuth 2.0 data.
 */
export const saveAuthData = (accessToken, refreshToken, accessExpiration) => {
  localStorage.setItem('auth', JSON.stringify({
    accessToken,
    refreshToken,
    accessExpiration,
  }));
};

/**
 * Returns auto 2.0 data.
 */
export const getAuthData = () => (
  JSON.parse(localStorage.getItem('auth') || '{}')
);
