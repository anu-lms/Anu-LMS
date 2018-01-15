import superAgent from 'superagent';
import superagentDefaults from 'superagent-defaults';
import superagentJsonapify from 'superagent-jsonapify';
import superagentPrefix from 'superagent-prefix';
import { BACKEND_SERVER_URL, BACKEND_CLIENT_URL } from './url';

// If window is not defined it means that js processment happens
// on the node.js server, so set up full Drupal URL as a URL to make
// requests to.
const backendURL = typeof window === 'undefined' ? BACKEND_SERVER_URL : BACKEND_CLIENT_URL;
const prefix = superagentPrefix(backendURL);

// Get superagent object & make it ready to set some default values.
// Make superagent library know how to handle JSON API responses &
// provide magic methods for working with responses based on JSON API
// specification.
const superagent = superagentDefaults(superagentJsonapify(superAgent));

// Pre-define superagent client
superagent
// Set the right URL prefix so that the request always
// gets to the right place despite of being executed on
// the server or client level.
  .use(prefix)
  // Default headers for JSON API ingegration in Drupal.
  .set('Content-Type', 'application/vnd.api+json')
  .set('Accept', 'application/vnd.api+json')
  .set('X-Consumer-ID', '9e0c1ed1-541b-45da-9360-8b41f206352c');

export default superagent;
