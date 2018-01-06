import React from 'react';
import App from '../components/App';
import HtmlHead from '../components/HtmlHead';
import ErrorPage from '../components/ErrorPage';

const Error = (props) => (
  props.statusCode !== null &&
  <App>
    <HtmlHead
      metaData={props.metaData}
      analytics={props.analytics}
      favicon={props.favicon}
    />
    <ErrorPage code={props.statusCode} />
  </App>
);

export default Error;
