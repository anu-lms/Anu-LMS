export const plural = (number, single, plural) => {
  return number === 1 ? single : plural;
};

export const humanizeFileName = fileName => {

  // Remove file extension.
  let string = fileName.replace(/\.[^/.]+$/, "");

  // Remove all charts apart from alphanumeric.
  string = string.replace(/[^0-9a-z]/gi, ' ');

  // Return string with first letter force uppercased.
  return string.charAt(0).toUpperCase() + string.slice(1);
};
