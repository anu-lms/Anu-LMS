import React from 'react';
import PageWithContext from '../components/PageWithContext';
import superagent from '../lib/request';
import { articleURL } from '../lib/url';
import ErrorPage from '../components/ErrorPage';
import getDomain from '../lib/getDomain';

class SiteMapPage {
  render() {
    return (
      <ErrorPage code={this.props.statusCode} />
    );
  }
}

SiteMapPage.getInitialProps = async ({ res }) => {
  let response;
  const initialProps = {};

  initialProps.statusCode = res && res.statusCode ? res.statusCode : 200;
  initialProps.sitemap = [];
  initialProps.sitemap.push('/');

  /*try {
    response = await superagent
      .get('/jsonapi/node/article')
      .query({
        'fields[node--article]': 'field_article_path,status',
        'filter[status][value]': 1,
      });

    response.body.data.forEach(item => item.fieldArticlePath ? initialProps.sitemap.push(articleURL(item.fieldArticlePath)) : '');
  } catch (e) {
    initialProps.statusCode = 404;
    console.log(e);
  }*/

  const domain = getDomain();
  let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  initialProps.sitemap.forEach((item) => {
    xml += '<url>';
    xml += `<loc>${domain}${item}</loc>`;
    xml += '</url>';
  });
  xml += '</urlset>';

  if (res) res.statusCode = initialProps.statusCode;
  if (initialProps.statusCode === 200) {
    res.header('Content-Type', 'text/xml');
    res.send(xml);
  }
  else {
    return ({
      statusCode: initialProps.statusCode,
    });
  }
};

export default SiteMapPage;
