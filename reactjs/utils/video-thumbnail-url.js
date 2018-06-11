import urlParse from 'url-parse';
import superagent from 'superagent';

// Extract id from url path
const RE_VIMEO = /^(?:\/video|\/channels\/[\w-]+|\/groups\/[\w-]+\/videos)?\/(\d+)$/;
const RE_YOUTUBE = /^(?:\/embed)?\/([\w-]{10,12})$/;

/**
 *
 *
 * Based on https://github.com/Producters/video-thumbnail-url/blob/master/src/index.js
 */
export const getThumbnailUrl = url => new Promise((resolve, reject) => {
  url = url || '';
  const urlobj = urlParse(url, true);

  // Youtube
  if (['www.youtube.com', 'youtube.com', 'youtu.be'].indexOf(urlobj.host) !== -1) {
    let videoId = null;
    if ('v' in urlobj.query) {
      if (urlobj.query.v && urlobj.query.v.match(/^[\w-]{10,12}$/)) {
        videoId = urlobj.query.v;
      }
    } else {
      const match = RE_YOUTUBE.exec(urlobj.pathname);
      if (match) {
        videoId = match[1]; // eslint-disable-line prefer-destructuring
      }
    }
    if (videoId) {
      resolve(`http://img.youtube.com/vi/${videoId}/mqdefault.jpg`);
    }
    else {
      console.error('Could not fetch Youtube thumbnail image.', error);
      reject(error);
    }
  }

  // Vimeo
  else if (['www.vimeo.com', 'vimeo.com', 'player.vimeo.com'].indexOf(urlobj.host) !== -1) {
    const match = RE_VIMEO.exec(urlobj.pathname);
    if (match) {
      const videoId = match[1];
      superagent
        .get(`https://vimeo.com/api/v2/video/${videoId}.json`)
        .query({ '_format': 'json' })
        .then(({ body }) => {
          resolve(body[0].thumbnail_medium);
        })
        .catch(error => {
          console.error('Could not fetch Vimeo thumbnail image.', error);
          reject(error);
        });
    }
    else {
      reject("Can't parse url to get Vimeo thumbnail image.");
    }
  }
  else {
    reject("Can't parse url to get thumbnail image.");
  }
});
