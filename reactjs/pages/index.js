import React from 'react';
import superagent from '../lib/request';
import PageWithContext from '../components/PageWithContext';
import App from '../components/App/index';
import HtmlHead from '../components/HtmlHead';
import ErrorPage from '../components/ErrorPage';
import {
  processArticleData,
  processMetaData,
} from '../lib/dataProcessor';
import globalInitialProps from '../lib/globalInitialProps';

class FrontPage extends PageWithContext {
  render() {
    return (
      <App
        siteName={this.props.siteName}
        menuData={this.props.menuData}
        footerData={this.props.footerData}
        logoData={this.props.logoData}
        title={this.props.title}
        subTitle={this.props.subTitle}
        domain={this.props.domain}
      >
        <HtmlHead metaData={this.props.metaData} analytics={this.props.analytics} favicon={this.props.favicon} />

        {this.props.statusCode && this.props.statusCode !== 200 ? <ErrorPage code={this.props.statusCode} /> :
          <div>Home page</div>
        }
      </App>
    );
  }
}

export default FrontPage;
