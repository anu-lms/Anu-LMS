import App, { Container } from 'next/app';
import React from 'react';
import withSocket from '../application/withSocket';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

// @todo: add withRedux and withAuth here, because it's used on all pages anyway.
export default withSocket(MyApp);
