/**
 * Returns user human readable name.
 *
 * @param name
 *   Username.
 *
 * @param firstName
 *   User first name.
 *
 * @param lastName
 *   User last name
 *
 * @returns string
 */
export const getUsername = ({name, firstName, lastName}) => {

  let username = '';
  if (firstName) {
    username = firstName.trim();
  }

  if (lastName) {
    username = username.length === 0 ? lastName.trim() : username + ' ' + lastName.trim();
  }

  if (username.length === 0) {
    username = name.trim();
  }

  return username;
};

/**
 * Returns 2-chars user initials generated from his name.
 *
 * @param name
 *   Username.
 *
 * @param firstName
 *   User first name.
 *
 * @param lastName
 *   User last name
 *
 * @returns string
 */
export const getInitials = ({name, firstName, lastName}) => {

  // First get human readable username which will be displayed for a user.
  let username = getUsername({name, firstName, lastName});

  // If a username consist from at least two words (first name and last name),
  // then the initials should be generated based on first letters of those
  // two words.
  username = username.split(' ');
  if (username.length > 1) {
    return username[0].replace(/[^0-9a-z]/gi, '').substring(0, 1) +
      username[1].replace(/[^0-9a-z]/gi, '').substring(0, 1)
  }

  // Otherwise just take the first 2 letters of the username.
  return username[0].replace(/[^0-9a-z]/gi, '').substring(0, 2);
};

/**
 * Returns hex color of the user based on his username.
 *
 * @param name
 *   Username.
 *
 * @param firstName
 *   User first name.
 *
 * @param lastName
 *   User last name
 *
 * @returns string
 */
export const getUserColor = ({name, firstName, lastName}) => {

  // Get two chars user initials.
  const initials = getInitials({name, firstName, lastName});

  // We need just the first letter of it.
  const firstLetter = initials.substr(0, 1).toLowerCase();

  // English alphabet string!
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';

  // Get position of the first user name letter in the alphabet.
  const index = alphabet.indexOf(firstLetter);

  // List of possible user colors.
  const colors = [
    '#4698c9',
    '#de6b48',
    '#2a4d66',
    '#98dfb4',
  ];

  // Depending on a user name letter index in the alphabet return an
  // appropriate color. The indexes & color matching was taken randomly
  // so feel free to change it if necessary.
  if (index < 7) {
    return colors[0];
  }

  if (index < 13) {
    return colors[1];
  }

  if (index < 20) {
    return colors[2];
  }

  return colors[3];
};
