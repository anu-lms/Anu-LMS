import urlParse from 'url-parse';

// Define URL to use when making requests from node.js server
// to the backend.
export const BACKEND_SERVER_URL = process.env.NODE_ENV !== 'production' ? process.env.BASE_URL : `${process.env.BASE_URL}/admin`;

// All client requests from the browser can be made simply to
// the subfolder.
export const BACKEND_CLIENT_URL = '/admin';

export const fileUrl = url => {
  // For local development replaces the absolute URL the backend with
  // relative for front-end rendering.
  if (url && process.env.NODE_ENV === 'development') {
    let parser = urlParse(url);
    const includesClientUrl = parser.pathname.indexOf(BACKEND_CLIENT_URL) === 0;
    const drupalUrl = parser.pathname.indexOf('/sites/default/files/') !== -1;
    if (!includesClientUrl && drupalUrl) {
      return BACKEND_CLIENT_URL + parser.pathname + parser.query;
    }
    return parser.toString();
  }
  return url;
};
