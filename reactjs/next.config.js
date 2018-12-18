const globImporter = require('node-sass-glob-importer');
const webpack = require('webpack');

module.exports = {
  webpack: (config, { dev }) => { // eslint-disable-line no-unused-vars
    config.module.rules.push(
      {
        test: /\.(css|scss)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader'],
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          'babel-loader',
          'raw-loader',
          {
            loader: 'sass-loader',
            options: {
              importer: globImporter(),
            },
          },
        ],
      },
    );
    // Make environment variables (.env.local or on platform.sh) available to the client,
    // and set default values (empty string).
    config.plugins.push(new webpack.EnvironmentPlugin({
      GTM_QUERY: '',
      GTM_ID: '',
      VIMEO_ACCESS_TOKEN: '',
      SENTRY_DSN: '',
      CLIENT_ID: '',
      CLIENT_SECRET: '',
    }));

    return config;
  },
};
