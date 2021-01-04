const { merge } = require('webpack-merge');
const webpackConfig = require('./webpack.config');

module.exports = merge(webpackConfig, {
  mode: 'development',
  devtool: 'source-map',

  devServer: {
    host: '0.0.0.0',
  },
});
