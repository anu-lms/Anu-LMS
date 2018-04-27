import Debug from 'debug';
import React from 'react';
import PropTypes from 'prop-types';

const debug = Debug('anu:sticky');

/**
 * Based on https://github.com/themeteorchef/react-sticky-scroll/blob/master/imports/ui/components/sticky.js.
 */
class Sticky extends React.Component {
  componentDidMount() {
    const stickies = document.querySelectorAll('[data-sticky]');
    debug('componentDidMount:stickies', stickies);

    this.setInitialHeights(stickies);

    const rootElement = this.props.rootId ? document.getElementById(this.props.rootId) : document;
    this.onScrollHandlerId = () => { this.onScroll(stickies); };
    rootElement.addEventListener('scroll', this.onScrollHandlerId);
  }

  componentWillUnmount() {
    const rootElement = this.props.rootId ? document.getElementById(this.props.rootId) : document;
    rootElement.removeEventListener('scroll', this.onScrollHandlerId);
  }

  onScroll(stickies) {
    const parentElement = this.getParentElement();

    const top = parentElement.scrollTop;
    const bottom = parentElement.scrollHeight;

    [].forEach.call(stickies, sticky => {
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

  setInitialHeights = stickies => {
    const parentElement = this.getParentElement();
    debug('setInitialHeights:parentElement', parentElement);

    [].forEach.call(stickies, sticky => {
      const top = parentElement.scrollTop;
      const elementTop = sticky.getBoundingClientRect().top;
      sticky.setAttribute('data-sticky-initial', top + elementTop);
      debug('setInitialHeights', { top, elementTop, stickyInitial: top + elementTop });
    });
  };

  getParentElement() {
    // eslint-disable-next-line max-len
    let parentElement = document.documentElement.scrollTop ? document.documentElement : document.body;
    if (this.props.rootId) {
      parentElement = document.getElementById(this.props.rootId);
    }
    return parentElement;
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
  children: PropTypes.node.isRequired,
  rootId: PropTypes.string,
};

Sticky.defaultProps = {
  className: '',
  enter: null,
  exit: null,
  rootId: null,
};

export default Sticky;
