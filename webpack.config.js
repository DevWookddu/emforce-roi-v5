const path = require('path');

const mode = process.env.NODE_ENV;

module.exports = {
  mode,
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
