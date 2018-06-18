import urlParse from 'url-parse';
import superagent from 'superagent';

// Extract id from url path
const RE_VIMEO = /^(?:\/video|\/channels\/[\w-]+|\/groups\/[\w-]+\/videos)?\/(\d+)$/;
const RE_YOUTUBE = /^(?:\/embed)?\/([\w-]{10,12})$/;

/**
 * Returns an object with size and url to video preview by given video url (vimeo or youtube).
 *
 * Based on https://github.com/Producters/video-thumbnail-url/blob/master/src/index.js
 */
export const getThumbnail = url => new Promise((resolve, reject) => {
  url = url || '';
  const urlobj = urlParse(url, true);

  // Process Youtube link.
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
      resolve({
        url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        width: 320, // 16:9
        height: 180,
        title: '',
      });
    }
    else {
      console.error('Could not fetch Youtube thumbnail image.');
      reject(new Error('Could not fetch Youtube thumbnail image.'));
    }
  }

  // Process Vimeo link.
  else if (['www.vimeo.com', 'vimeo.com', 'player.vimeo.com'].indexOf(urlobj.host) !== -1) {
    const match = RE_VIMEO.exec(urlobj.pathname);
    if (match) {
      // @todo: variable doesn't available from Platform.sh hardcode value as workaround.
      // const vimeoAccessToken = process.env.VIMEO_ACCESS_TOKEN;
      const vimeoAccessToken = '2d4ff1a9d3b8ca858f4fa3c45a20082e';
      if (!vimeoAccessToken) {
        console.error('Vimeo access token isn\'t defined in environment variables');
        reject();
        return;
      }

      const videoId = match[1];
      superagent
        .get(`https://api.vimeo.com/videos/${videoId}`)
        .set('Authorization', `Bearer ${vimeoAccessToken}`)
        .query({ '_format': 'json' })
        .then(({ body }) => {
          resolve({
            url: body.pictures.sizes[3].link,
            width: 640, // 4:3
            height: 360,
            title: body.name,
          });
        })
        .catch(error => {
          console.error('Could not fetch Vimeo thumbnail image.', error);
          reject(error);
        });
    }
    else {
      reject(new Error("Can't parse url to get Vimeo thumbnail image."));
    }
  }
  else {
    reject(new Error("Can't parse url to get thumbnail image."));
  }
});
