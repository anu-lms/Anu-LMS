import React from 'react';
import request from '../lib/request';
import App from '../components/App';
import HtmlHead from '../components/HtmlHead';
import Test from '../components/Test';

const FrontPage = ({ metaData, analytics, favicon }) => (
  <App>

    <HtmlHead
      metaData={metaData}
      analytics={analytics}
      favicon={favicon}
    />

    <div>Home page</div>
    <Test />

  </App>
);

export default FrontPage;
