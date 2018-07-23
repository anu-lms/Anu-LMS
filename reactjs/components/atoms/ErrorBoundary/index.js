import React from 'react';
import PropTypes from 'prop-types';
import Raven from 'raven-js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    if (Raven) {
      Raven.captureException(error, { extra: errorInfo });
    }
  }

  // @todo: Improve behaviour, make message configurable.
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          Internal site error.<br /> Please try to reload the page or contact site administrator.
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
