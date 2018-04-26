
const easeInOutQuad = (t, b, c, d) => {
  t /= d / 2;
  if (t < 1) return ((c / 2) * t * t) + b;
  t -= 1;
  return ((-c / 2) * ((t * (t - 2)) - 1)) + b;
};

// Based on https://gist.github.com/andjosh/6764939#gistcomment-2553779
export const scrollTo = (element, to = 0, duration = 1000, callback = () => {}) => {
  const start = element.scrollTop;
  const change = to - start;
  const increment = 20;
  let currentTime = 0;

  const animateScroll = (() => {
    currentTime += increment;

    element.scrollTop = easeInOutQuad(currentTime, start, change, duration);

    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
    else {
      callback();
    }
  });

  animateScroll();
};
