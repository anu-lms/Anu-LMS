const compression = require('compression');
const express = require('express');
const nextjs = require('next');
const sass = require('node-sass');
const routes = require('./routes');
const cookieParser = require('cookie-parser');
const globImporter = require('node-sass-glob-importer');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

// Override env vars for platform.sh environment.
if (process.env.PLATFORM_PROJECT) {

  // Load platform.sh config.
  const config = require('platformsh').config();

  // Override environment port.
  process.env.PORT = config.port;

  for (let url in config.routes) {
    let route = config.routes[url];
    if (route.original_url === 'https://{default}/admin/') {
      // Remove "/admin/" from the end of the url.
      process.env.BASE_URL = url.substring(0, url.length - 7);
    }
  }
}
else {
  // Load environment variables from .env (for production) or
  // .env.local (for local development) file.
  let dotEnvFilePath = process.env.NODE_ENV !== 'production' ? './.env.local' : './.env';
  require('dotenv').config({
    path: dotEnvFilePath,
  });
}

// Log some basic data.
console.log('PORT: ' + process.env.PORT);
console.log('BASE URL: ' + process.env.BASE_URL);

const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dev });
const handler = routes.getRequestHandler(app);

app.prepare()
  .then(() => {
    const server = express();

    // Serve gzipped content where possible.
    server.use(compression());

    // Convert cookies string into an object.
    server.use(cookieParser());

    // Add route to serve compiled SCSS from /assets/{build id}/main.css
    // Note: This is only used in production, in development css is inline.
    const sassResult = sass.renderSync({ file: './styles/theme.scss', outputStyle: 'compressed', importer: globImporter() });
    server.get('/assets/:id/main.css', (req, res) => {
      res.setHeader('Content-Type', 'text/css');
      res.setHeader('Cache-Control', 'public, max-age=2592000');
      res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
      res.send(sassResult.css);
    });

    // Send robots.txt file from /static folder.
    const options = {
      root: __dirname + '/static/',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
    };
    server.get('/robots.txt', (req, res) => (
      res.status(200).sendFile('robots.txt', options)
    ));

    // Set browser caching for all static files.
    server.use('/static', express.static(__dirname + '/static', {
      maxAge: '7d',
    }));

    server.use(handler).listen(process.env.PORT);
  });
