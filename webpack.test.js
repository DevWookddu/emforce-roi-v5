/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const common = require('./webpack.dev.js');

module.exports = merge(common, {
  entry: './test/script-async-load.js',
});
