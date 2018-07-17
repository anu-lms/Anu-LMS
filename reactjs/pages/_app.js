import App, { Container } from 'next/app';
import React from 'react';
import withSocket from '../application/withSocket';

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    console.log('_app render', this.props);
    return (
      <Container>
        <Component {...pageProps} socket={this.props.socket} />
      </Container>
    );
  }
}

export default withSocket(MyApp);
