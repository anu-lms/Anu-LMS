import React from 'react';
import Raven from 'raven-js';
import Package from '../package';

/**
 * Integration with https://sentry.io service to monitor and log any error messages on client side.
 */
function withSentry(Child) {
  return class WrappedComponent extends React.Component {
    static getInitialProps(context) {
      if (Child.getInitialProps) {
        return Child.getInitialProps(context);
      }
      return {};
    }

    constructor(props) {
      super(props);
      this.state = {
        error: null,
      };
    }

    componentDidMount() {
      console.log('SENTRY_DSN', process.env.SENTRY_DSN);
      // We integrate Raven in ComponentDidMount to use console plugin (doesn't work in other place)
      Raven
        .config(process.env.SENTRY_DSN, {
          release: Package.version,
        })
        .addPlugin(require('raven-js/plugins/console')) // eslint-disable-line global-require
        .install();
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      Raven.captureException(error, { extra: errorInfo });
    }

    render() {
      return <Child {...this.props} error={this.state.error} />;
    }
  };
}

export default withSentry;
