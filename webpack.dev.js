/* eslint-disable import/no-extraneous-dependencies */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  entry: './src/dev/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  devtool: 'eval-source-map',
  devServer: {
    disableHostCheck: true,
    compress: false,
    host: '0.0.0.0',
    port: 8080,
    https: false,
    historyApiFallback: true,
  },
});
