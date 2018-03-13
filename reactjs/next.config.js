const globImporter = require('node-sass-glob-importer');
const webpack  = require('webpack');

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
    // Make GTM_QUERY and GTM_ID environment variables available to the client, and set default values (empty sting).
    config.plugins.push(new webpack.EnvironmentPlugin({'GTM_QUERY': '', 'GTM_ID': ''}));

    return config;
  },
};
