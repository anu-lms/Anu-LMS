// Define URL to use when making requsts from node.js server
// to the backend.
const BACKEND_SERVER_URL = process.env.NODE_ENV !== 'production' ? process.env.BASE_URL : `${process.env.BASE_URL}/admin`;

// All client requests from the browser can be made simply to
// the subfolder.
const BACKEND_CLIENT_URL = '/admin';

// URL for a file referenced to the backend.
const fileURL = url => (
  url.replace(BACKEND_SERVER_URL, BACKEND_CLIENT_URL)
);

// Нормализация урл для получения сущности при использовании decoupled routes
const decoupleURL = url => {
  if (process.env.NODE_ENV !== 'production') {
    url = url.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '/');
    if (typeof window !== 'undefined') url = url.replace(BACKEND_CLIENT_URL, '');
  }else{
    url = url.replace(BACKEND_SERVER_URL, '');
  }
  return url;
};

// URL for a product view page.
const articleURL = url => (
  `/blog${url}`
);

const tagUrl = url => (
  `/blog?tag=${url.slice(1, url.length)}`
);

export {
  BACKEND_CLIENT_URL,
  BACKEND_SERVER_URL,
  fileURL,
  articleURL,
  decoupleURL,
  tagUrl,
};
