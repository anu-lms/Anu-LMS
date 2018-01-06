import React from 'react';
import App from '../components/App/index';
import HtmlHead from '../components/HtmlHead';
import PageWithContext from '../components/PageWithContext';
import ErrorPage from '../components/ErrorPage';

class Error {

  static getInitialProps = async ({ res, pathname, xhr }) => {
    const statusCode = res ? res.statusCode : (xhr ? xhr.status : null);
    /*return Object.assign(
      await getStaticFile(),
      {
        pathname,
        statusCode,
        metaData: {
          title: `${statusCode} error`,
          description: '',
          keywords: '',
      },
    });*/
  };

  render() {
    return (
      this.props.statusCode !== null &&
      <App
        siteName={this.props.siteName}
        domain={this.props.domain}
        menuData={this.props.menuData}
        footerData={this.props.footerData}
        logoData={this.props.logoData}
      >
        <HtmlHead
          metaData={this.props.metaData}
          analytics={this.props.analytics}
          favicon={this.props.favicon}
        />
        <ErrorPage code={this.props.statusCode} />
      </App>
    );
  }
}

export default Error;
