import { BACKEND_CLIENT_URL } from '../utils/url';

export const viewUrl = (fileId, accessToken) => (
  `${BACKEND_CLIENT_URL}/private-files/${fileId}/${accessToken}`
);

export const downloadUrl = (fileId, accessToken) => (
  `${BACKEND_CLIENT_URL}/private-files/${fileId}/${accessToken}/download`
);
