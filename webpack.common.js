const path = require('path');

module.exports = {
  entry: './src/RoiV5.js',
  output: {
    filename: 'emforce-roi-v5.js',
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
  resolve: {
    alias: {
      '@@state': path.resolve(__dirname, 'src/state.js'),
    },
  },
};
