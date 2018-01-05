import superagent from '../lib/request';
import getDomain from './getDomain';
import { processGlobalSettings, processSiteMenu, processAnalytics } from './dataProcessor';

const globalInitialProps = async () => {
  const domain = getDomain();

  let response;
  let global_settings;
  let menuData;
  let analytics;
  let statusCode = 200;

  try {
    response = await superagent
      .get('/jsonapi/config_pages/global_settings')
      .query({
        'include': 'field_logo,field_social_links,field_favicon',
        'fields[config_pages--global_settings]': 'field_site_name,field_logo,field_social_links,field_favicon',
        'fields[file--image]': 'url,meta',
        'fields[file--file]': 'url',
      });

    if (response.body.data.length) global_settings = processGlobalSettings(response.body.data[0]);
  } catch (e) {
    statusCode = 500;
    console.log(e);
  }

  try {
    response = await superagent
      .get('/jsonapi/config_pages/analytics')
      .query({
        'fields[config_pages--analytics]': 'field_google_tag_manager,field_google_analytics,field_yandex_metrika'
      });

    if (response.body.data.length) analytics = processAnalytics(response.body.data[0]);
  } catch (e) {
    console.log(e);
  }

  const result = Object.assign({domain}, global_settings, analytics);
  if (statusCode !== 200) result.statusCode = statusCode;
  return result;
};

export default globalInitialProps;
