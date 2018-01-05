import React from 'react';
import PropTypes from 'prop-types';

// This class provides "pathname" context to
// all child components.
class PageWithContext extends React.Component {

  static getInitialProps({ pathname, req }) {
    return { pathname: (req && req.url) || pathname };
  }

  static childContextTypes = {
    pathname: PropTypes.string,
    domain: PropTypes.string,
  };

  static propTypes = {
    pathname: PropTypes.string,
    domain: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.node),
  };

  getChildContext() {
    return {
      pathname: this.props.pathname,
      domain: this.props.domain,
    };
  }

  render() {
    return this.props.children;
  }
}

export default PageWithContext;
