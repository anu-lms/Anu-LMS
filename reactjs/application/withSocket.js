import React from 'react';
import socketio from 'socket.io-client';

/**
 * Integration with Socket.io.
 */
export default function withSocket(Child) {
  return class WrappedComponent extends React.Component {
    static getInitialProps(context) {
      if (Child.getInitialProps) {
        return Child.getInitialProps(context);
      }
      return {};
    }

    constructor(props) {
      super(props);
      this.socket = null;
      if (typeof window !== 'undefined') {
        this.socket = socketio();
      }
    }

    /**
     * Close socket connection.
     */
    componentWillUnmount() {
      this.socket.close();
    }

    render() {
      return <Child {...this.props} socket={this.socket} />;
    }
  };
}
