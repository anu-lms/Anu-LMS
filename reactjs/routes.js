const routes = module.exports = require('next-routes')();

// @see https://github.com/fridays/next-routes
// Additional dynamic routes.
routes
  .add('_lesson', '/course/:course/:lesson');

