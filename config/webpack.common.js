/* global require, module */
const paths = require('./paths');

module.exports = {
  entry: {
    birthdaypicker: ['@/index.js'],
  },

  devtool: 'source-map',

  output: {
    path: paths.build,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },

  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src,
    },
  },
};
