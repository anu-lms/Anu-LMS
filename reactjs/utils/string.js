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

// Based on https://github.com/yusrilhs/str-truncate/blob/master/index.js
export const truncate = (text, length, clamp) => {
  clamp = clamp || '...';

  // Return original when length is satisfied
  if (text.length <= length) return text;

  const cpText = text.slice(0, length - clamp.length);
  let last = cpText.length - 1;

  while (last > 0 && cpText[last] !== ' ' && cpText[last] !== clamp[0]) {
    last -= 1;
  }

  last = last || length - clamp.length;

  return cpText.slice(0, last) + clamp;
};
