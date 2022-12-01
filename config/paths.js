/* global __dirname, require, module */
const path = require('path');

module.exports = {
  src: path.resolve(__dirname, '../src'),

  // Production build files
  build: path.resolve(__dirname, '../dist'),

  // Static files that get copied to build folder
  examples: path.resolve(__dirname, '../examples'),
};
