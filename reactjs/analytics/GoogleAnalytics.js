import React from 'react';
import Head from 'next/head';

class GoogleAnalytics extends React.Component{
  // Send stats of page transitions to Google Analytics.
  componentDidMount() {
    gtag('config', this.props.analyticId, {
      'page_title': this.props.pageTitle,
      'page_location': window.location.href,
      'page_path': window.location.pathname
    });
  }
  render(){
    return (
      <Head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${this.props.analyticId}`} key="GA1" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());gtag('config', '${this.props.analyticId}');` }} key="GA2" />
      </Head>
    )
  }
}
export default GoogleAnalytics;
