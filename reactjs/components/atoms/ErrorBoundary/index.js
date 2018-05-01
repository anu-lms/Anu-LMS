import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch() {
    this.setState({ hasError: true });
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
