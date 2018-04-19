import Debug from 'debug';
import React from 'react';
import PropTypes from 'prop-types';

const debug = Debug('anu:sticky');

/**
 * Based on https://github.com/themeteorchef/react-sticky-scroll/blob/master/imports/ui/components/sticky.js.
 */
class Sticky extends React.Component {
  componentDidMount() {
    const parentElement = this.props.rootId ? document.getElementById(this.props.rootId) : document.documentElement || document.body;
    debug('componentDidMount:parentElement', parentElement);

    const stickies = document.querySelectorAll('[data-sticky]');
    debug('componentDidMount:stickies', stickies);

    this.setInitialHeights(parentElement, stickies);

    const rootElement = this.props.rootId ? document.getElementById(this.props.rootId) : document;
    this.onScrollHandlerId = () => { this.onScroll(parentElement, stickies) };
    rootElement.addEventListener('scroll', this.onScrollHandlerId);
  }

  componentWillUnmount() {
    const rootElement = this.props.rootId ? document.getElementById(this.props.rootId) : document;
    rootElement.removeEventListener('scroll', this.onScrollHandlerId);
  }

  setInitialHeights = (parentElement, elements) => {
    [].forEach.call(elements, (sticky) => {

      const top = parentElement.scrollTop;
      const elementTop = sticky.getBoundingClientRect().top;
      sticky.setAttribute('data-sticky-initial', top + elementTop);
      debug('setInitialHeights', { top, elementTop, stickyInitial: top + elementTop });
    });
  };

  onScroll(parentElement, stickies) {
    const top = parentElement.scrollTop;
    const bottom = parentElement.scrollHeight;

    [].forEach.call(stickies, (sticky) => {
      const stickyInitial = parseInt(sticky.getAttribute('data-sticky-initial'), 10);
      const stickyEnter = parseInt(sticky.getAttribute('data-sticky-enter'), 10) || stickyInitial;
      const stickyExit = parseInt(sticky.getAttribute('data-sticky-exit'), 10) || bottom;

      if (top >= stickyEnter && top <= stickyExit) {
        sticky.classList.add('sticky');
      } else {
        sticky.classList.remove('sticky');
      }
      debug('scroll', { top, bottom, stickyEnter, stickyExit });
    });
  }

  render() {
    const { className, enter, exit, children } = this.props;
    return (
      <div
        className={`sticky-element ${className}`}
        data-sticky
        data-sticky-enter={enter}
        data-sticky-exit={exit}
      >
        {children}
      </div>
    );
  }
}

Sticky.propTypes = {
  className: PropTypes.string,
  enter: PropTypes.string,
  exit: PropTypes.string,
  children: PropTypes.node,
  parentId: PropTypes.string,
};

export default Sticky;
