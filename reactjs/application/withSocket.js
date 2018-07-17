import React from 'react';
import socketio from 'socket.io-client';
import { SocketProvider } from 'socket.io-react';

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
      return (
        <SocketProvider socket={this.socket}>
          <Child {...this.props} />;
        </SocketProvider>
      );
    }
  };
}
