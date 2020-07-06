/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');

let filename = 'emforce-roi-v5.js';
const plugins = [];
const isBeta = process.env.NODE_ENV === 'beta';
if (isBeta) {
  filename = `beta-${filename}`;
  plugins.push(
    new webpack.DefinePlugin({
      'process.env.CALL': JSON.stringify('beta'),
    })
  );
}

module.exports = {
  entry: './src/EmfV5.js',
  output: {
    filename,
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          'eslint-loader',
        ],
      },
    ],
  },
  plugins,
  resolve: {
    alias: {
      '@@state': path.resolve(__dirname, 'src/state/state.js'),
      '@constant': path.resolve(__dirname, 'src/lib/constant'),
      '@util': path.resolve(__dirname, 'src/lib/util'),
      '@module': path.resolve(__dirname, 'src/lib/module'),
    },
  },
};
