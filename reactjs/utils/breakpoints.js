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
export const isUp = (name) => {
  return window.innerWidth > breakpoints[name];
};

export const isDown = (name) => {
  return window.innerWidth < breakpointMax(name);
};

export const isBetween = (lower, upper) => {
  return window.innerWidth > breakpoints[lower] && window.innerWidth < breakpointMax(upper);
};

// @todo: implement behaviour for Only.
export const isOnly = (name) => {
  return false;
};

const breakpointMax = (name) => {
  return breakpoints[name] - 0.02;
};
