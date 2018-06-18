import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Package from '../package';
import inlineCSS from '../styles/theme.scss';
import GoogleTagManager from '../components/atoms/GTM/gtm';

const HtmlHead = ({ title, favicon }) => {
  let stylesheets;
  // GTM_ID is taken from .env.local file or platform.sh environment variables.
  const gtmId = process.env.GTM_ID;
  const vimeoAccessToken = process.env.VIMEO_ACCESS_TOKEN;


  console.log('HtmlHead', gtm, vimeoAccessToken);

  // GTM_QUERY is taken from .env.local file or platform.sh environment variables,
  // it is needed to non-live environments only.
  const query = process.env.PLATFORM_BRANCH === 'master' ? null : process.env.GTM_QUERY;

  if (process.env.NODE_ENV === 'production') {
    // In production, serve pre-built CSS file from /assets/{version}/main.css
    const pathToCSS = `/assets/${Package.version}/main.css`;
    stylesheets = <link rel="stylesheet" type="text/css" href={pathToCSS} />;
  }
  else {
    // eslint-disable-next-line react/no-danger
    stylesheets = <style dangerouslySetInnerHTML={{ __html: inlineCSS }} />;
  }

  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      {gtmId &&
      <GoogleTagManager gtmId={gtmId} previewVariables={query} />
      }
      <link href="https://fonts.googleapis.com/css?family=Lato:300,400,600" rel="stylesheet" />
      {!!favicon && <link rel="shortcut icon" href={favicon} type="image/vnd.microsoft.icon" />}
      {stylesheets}
    </Head>
  );
};

HtmlHead.propTypes = {
  title: PropTypes.string,
  favicon: PropTypes.string,
};

HtmlHead.defaultProps = {
  title: 'Anu LMS',
  favicon: '/static/img/favicon.ico',
};

export default HtmlHead;
