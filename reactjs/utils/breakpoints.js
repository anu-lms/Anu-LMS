// Default Bootstrap breakpoints.
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1840
};

// @todo: improve functionality, show console warnings if window or breakpoint name missed.
// Consider other ways instead of `window` variable, because it's not available in all cases.
export const isUp = (name) => {
  return getPageWidth() >= breakpoints[name];
};

export const isDown = (name) => {
  return getPageWidth() < breakpoints[name];
};

export const isBetween = (lower, upper) => {
  return getPageWidth() >= breakpoints[lower] && window.innerWidth < breakpoints[upper];
};

// @todo: implement behaviour for Only.
export const isOnly = (name) => {
  return false;
};

export const getPageWidth = () => (
  Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  )
);
