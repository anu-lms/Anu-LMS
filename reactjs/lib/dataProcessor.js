import moment from 'moment';
import 'moment-timezone';

const processGlobalSettings = (data) => {
  let footerData = {};
  let logoData = {};

  const favicon = data.fieldFavicon && data.fieldFavicon.url ? data.fieldFavicon.url : '';

  const siteName = data && data.fieldSiteName ? data.fieldSiteName : '';

  if (data.fieldLogo){
    const item = data.fieldLogo;

    logoData.url = item.meta && item.meta.derivatives.full_size ? item.meta.derivatives.full_size :
      (item.uri ? item.uri : '');
    logoData.url_logo_style = item.meta && item.meta.derivatives.logo ? item.meta.derivatives.logo : '';
    logoData.alt = data.relationships.field_logo.data.meta.alt.alt ?
      data.relationships.field_logo.data.meta.alt.alt: '';
    logoData.title = '';
  }

  if (data.fieldSocialLinks) {
    footerData.socialNetworks = data.fieldSocialLinks.map(item => ({
      link: item.fieldSocialNetworkLink && item.fieldSocialNetworkLink.uri ? item.fieldSocialNetworkLink.uri : '',
      icon: item.fieldSocialNetworkIcon ? item.fieldSocialNetworkIcon : ''
    }));
  }

  footerData.edit = data.links && data.links.edit ? data.links.edit : '';
  logoData.edit = data.links && data.links.edit ? data.links.edit : '';

  return {
    footerData,
    logoData,
    siteName,
    favicon,
  }
};

const processAnalytics = (data) => {
  const analytics = {};
  // Google Tag Manager
  analytics.GTM = data.fieldGoogleTagManager ? data.fieldGoogleTagManager : '';

  // Google Analytics
  analytics.GA = data.fieldGoogleAnalytics ? data.fieldGoogleAnalytics : '';
  if (analytics.GA && typeof window !== 'undefined' ) window.gaTrackingId = `'${analytics.GA}'`;

  // Yandex Metrika
  analytics.YM = data.fieldYandexMetrika ? data.fieldYandexMetrika : '';
  return { analytics };
};

const processSiteMenu = (data) => {
  let menuData = {};
  if (data.fieldSiteMenu) {
    menuData.menu = data.fieldSiteMenu.map(item =>({
      name: item.fieldMenuItemLink && item.fieldMenuItemLink.title ? item.fieldMenuItemLink.title : '',
      url: item.fieldMenuItemLink && item.fieldMenuItemLink.uri ?
        item.fieldMenuItemLink.uri.replace(/^[a-zA-Z]{3,5}\:\/{2}[a-zA-Z0-9_.:-]+\//, '/') : '',
    }))
  }

  menuData.edit = data.links && data.links.edit ? data.links.edit : '';

  return  menuData
};

const processMetaData = data => ({
  title: data.title && data.title.attributes && data.title.attributes.content
    ? data.title.attributes.content : '',
  description: data.description && data.description.attributes
  && data.description.attributes.content ? data.description.attributes.content : '',
  keywords: data.keywords && data.keywords.attributes && data.keywords.attributes.content
    ? data.keywords.attributes.content : '',
});


export {
  processAnalytics,
  processMetaData,
  processGlobalSettings,
  processSiteMenu,
};
