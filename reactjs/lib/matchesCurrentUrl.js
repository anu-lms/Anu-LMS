const matchesCurrentUrl = (currentUrl, itemUrl) => (currentUrl.startsWith(itemUrl) && itemUrl !== '/') ||
  (itemUrl === '/' && currentUrl === '/');

export default matchesCurrentUrl;

