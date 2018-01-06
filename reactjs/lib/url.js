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

const decoupleURL = url => {
  if (process.env.NODE_ENV !== 'production') {
    url = url.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '/');
    if (typeof window !== 'undefined') url = url.replace(BACKEND_CLIENT_URL, '');
  }else{
    url = url.replace(BACKEND_SERVER_URL, '');
  }
  return url;
};

export {
  BACKEND_CLIENT_URL,
  BACKEND_SERVER_URL,
  fileURL,
  decoupleURL,
};
