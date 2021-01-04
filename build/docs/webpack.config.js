const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const IS_DEV = process.env.NODE_ENV === 'development';

const dirRoot = path.resolve(__dirname, '..', '..');
const dirSrc = path.resolve(dirRoot, 'src', 'docs');

module.exports = {
  entry: {
    bundle: dirSrc,
  },

  output: {
    path: path.resolve(dirRoot, 'docs'),
  },

  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /(node_modules)/ },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: IS_DEV } },
        ],
      },
      {
        test: /\.scss/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { sourceMap: IS_DEV } },
          { loader: 'sass-loader', options: { sourceMap: IS_DEV } },
        ],
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'file-loader',
        options: { name: '[path][name].[contenthash:8].[ext]' },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(dirSrc, 'index.html'),
      title: 'zh-address-parse',
    }),
    new CleanWebpackPlugin(),
  ],
};
