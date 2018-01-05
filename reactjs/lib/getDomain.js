function getDomain() {
  let domain;
  if (typeof window === 'undefined') {
    domain = process.env.BASE_URL;
  }
  else {
    domain = window.location.origin;
  }
  return domain;
}

export default getDomain;
