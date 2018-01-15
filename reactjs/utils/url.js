// Define URL to use when making requsts from node.js server
// to the backend.
const BACKEND_SERVER_URL = process.env.NODE_ENV !== 'production' ? process.env.BASE_URL : `${process.env.BASE_URL}/admin`;

// All client requests from the browser can be made simply to
// the subfolder.
const BACKEND_CLIENT_URL = '/admin';

export {
  BACKEND_CLIENT_URL,
  BACKEND_SERVER_URL,
};
