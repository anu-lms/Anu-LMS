import React from 'react';
import request from '../lib/request';
import App from '../components/App';
import HtmlHead from '../components/HtmlHead';

const FrontPage = ({ metaData, analytics, favicon }) => (
  <App>

    <HtmlHead
      metaData={metaData}
      analytics={analytics}
      favicon={favicon}
    />

    <div>Home page</div>

  </App>
);

export default FrontPage;
