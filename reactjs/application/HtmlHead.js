import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import Package from '../package';
import inlineCSS from '../styles/theme.scss';

const HtmlHead = ({ title, favicon }) => {

  let stylesheets;
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
      <link href="https://fonts.googleapis.com/css?family=Lato:400,700,900" rel="stylesheet" />
      {!!favicon && <link rel="shortcut icon" href={favicon} type="image/vnd.microsoft.icon" />}
      {stylesheets}
    </Head>
  );
};

HtmlHead.propTypes = {
  favicon: PropTypes.string,
};

HtmlHead.defaultProps = {
  title: 'Anu LMS',
  favicon: '/static/img/favicon.ico',
};

export default HtmlHead;
