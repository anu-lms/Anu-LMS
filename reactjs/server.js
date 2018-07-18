const compression = require('compression');
const express = require('express');
const basicAuth = require('express-basic-auth');
const nextjs = require('next');
const sass = require('node-sass');
const cookieParser = require('cookie-parser');
const globImporter = require('node-sass-glob-importer');
const httpServer = require('http');
const socketio = require('socket.io');
const requestProxy = require('express-request-proxy');
const routes = require('./routes');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

// Override env vars for platform.sh environment.
if (process.env.PLATFORM_PROJECT) {
  // Load platform.sh config.
  const config = require('platformsh').config(); // eslint-disable-line global-require

  // Override environment port.
  process.env.PORT = config.port;

  for (let url in config.routes) { // eslint-disable-line no-restricted-syntax, guard-for-in
    const route = config.routes[url];
    if (route.original_url === 'https://{default}/admin/') {
      // Remove "/admin/" from the end of the url.
      process.env.BASE_URL = url.substring(0, url.length - 7);
    }
  }
}
else {
  // Load environment variables from .env (for production) or
  // .env.local (for local development) file.
  const dotEnvFilePath = process.env.NODE_ENV !== 'production' ? './.env.local' : './.env';
  require('dotenv').config({ // eslint-disable-line global-require
    path: dotEnvFilePath,
  });
}

// Log some basic data.
console.log(`PORT: ${process.env.PORT}`);
console.log(`BASE URL: ${process.env.BASE_URL}`);

const dev = process.env.NODE_ENV !== 'production';
const app = nextjs({ dev });
const handler = routes.getRequestHandler(app);

app.prepare()
  .then(() => {
    // Initialize express.js server.
    const expressServer = express();

    // Make sure we enable http auth only on platform.sh dev branches.
    if (process.env.PLATFORM_BRANCH && process.env.PLATFORM_BRANCH !== 'master') {
      // Make sure that we do have http user & password set in variables.
      if (process.env.HTTP_AUTH_USER && process.env.HTTP_AUTH_PASS) {
        expressServer.use(basicAuth({
          users: {
            [process.env.HTTP_AUTH_USER]: process.env.HTTP_AUTH_PASS,
          },
          challenge: true,
        }));
      }
    }

    // Serve gzipped content where possible.
    expressServer.use(compression());

    // Convert cookies string into an object.
    expressServer.use(cookieParser());

    // Add route to serve compiled SCSS from /assets/{build id}/main.css
    // Note: This is only used in production, in development css is inline.
    const sassResult = sass.renderSync({
      file: './styles/theme.scss',
      outputStyle: 'compressed',
      importer: globImporter(),
    });

    expressServer.get('/assets/:id/main.css', (req, res) => {
      res.setHeader('Content-Type', 'text/css');
      res.setHeader('Cache-Control', 'public, max-age=2592000');
      res.setHeader('Expires', new Date(Date.now() + 2592000000).toUTCString());
      res.send(sassResult.css);
    });

    // Vimeo requires secure access token using to get private video metadata.
    // We can't keep secure tokens on the frontend, so we make request from the frontend to
    // request proxy, request proxy gets key from the server environment variables,
    // attaches to the original request and make request to the url.
    expressServer.get('/api/vimeo/:id', requestProxy({
      url: 'https://api.vimeo.com/videos/:id',
      headers: {
        'Authorization': `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
      },
    }));

    // Send robots.txt file from /static folder.
    const options = {
      root: `${__dirname}/static/`,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
      },
    };
    expressServer.get('/robots.txt', (req, res) => (
      res.status(200).sendFile('robots.txt', options)
    ));

    // Blocks an access to the styleguide on live environment.
    if (!dev) {
      expressServer.use('/styleguide', (req, res) => {
        res.status(403).send('Access denied');
      });
    }

    // Set browser caching for all static files.
    expressServer.use('/static', express.static(`${__dirname}/static`, {
      maxAge: '7d',
    }));

    expressServer.use(handler);

    // Prepare http server including websocket connection.
    const server = httpServer.Server(expressServer);
    const io = socketio(server);

    // On platform.sh no one should be able to connect to the socket
    // outside of the domain.
    if (process.env.PLATFORM_PROJECT) {
      // eslint-disable-next-line
      io.origins([process.env.BASE_URL + ':443']);
    }

    io.on('connection', socket => {
      // Wait for new notification to come in and emit this event to
      // all connected browsers.
      socket.on('notification', notification => {
        socket.broadcast.emit(`notification.user.${notification.recipient}`, notification);
      });

      socket.on('comment', comment => {
        const lessonId = comment.data.lesson.nid;
        socket.broadcast.emit(`comment.lesson.${lessonId}`, comment);
      });
    });

    server.listen(process.env.PORT);
  });
