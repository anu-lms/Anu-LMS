// eslint-disable-next-line no-confusing-arrow, max-len
export const plural = (number, singleValue, pluralValue) => number === 1 ? singleValue : pluralValue;

export const humanizeFileName = fileName => {
  // Remove file extension.
  let string = fileName.replace(/\.[^/.]+$/, '');

  // Remove all charts apart from alphanumeric.
  string = string.replace(/[^0-9a-z]/gi, ' ');

  // Return string with first letter force uppercased.
  return string.charAt(0).toUpperCase() + string.slice(1);
};
