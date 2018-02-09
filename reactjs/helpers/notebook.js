import striptags from 'striptags';

export const getTeaser = (body) => {
  const maxTeaserLenght = 128;
  let teaser = striptags(body);
  teaser = teaser.trim().replace(/[&nbsp;]+/g, ' ').replace(/[\n\r\t ]+/g, ' ');
  return teaser.substring(0, maxTeaserLenght);
};