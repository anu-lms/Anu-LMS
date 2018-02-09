import striptags from 'striptags';

export const getTeaser = (body) => {
  const maxTeaserLenght = 128;
  // Strip HTML tags from the body.
  let teaser = striptags(body);
  // Trim text, remove whitespaces, new line and tabs chars.
  teaser = teaser.trim().replace(/[&nbsp;]+/g, ' ').replace(/[\n\r\t ]+/g, ' ');
  // Set max length for the text.
  return teaser.substring(0, maxTeaserLenght);
};
