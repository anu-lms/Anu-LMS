const globImporter = require('node-sass-glob-importer');
const webpack = require('webpack');

module.exports = {
  webpack: (config, { dev }) => {
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
            loader: "sass-loader",
            options: {
              importer: globImporter()
            }
          }
        ],
      }
    );

    // Push http auth to the browser vars.
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.HTTP_AUTH_USER': JSON.stringify(process.env.HTTP_AUTH_USER),
        'process.env.HTTP_AUTH_PASS': JSON.stringify(process.env.HTTP_AUTH_PASS),
      })
    );

    return config;
  },
};
