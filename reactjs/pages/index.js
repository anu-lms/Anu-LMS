import React from 'react';
import superagent from '../lib/request';
import App from '../components/App/index';
import HtmlHead from '../components/HtmlHead';
import ErrorPage from '../components/ErrorPage';

class FrontPage {
  render() {
    return (
      <App>

        <HtmlHead
          metaData={this.props.metaData}
          analytics={this.props.analytics}
          favicon={this.props.favicon}
        />

        { this.props.statusCode && this.props.statusCode !== 200
          ? <ErrorPage code={this.props.statusCode} />
          : <div>Home page</div>
        }

      </App>
    );
  }
}

export default FrontPage;
