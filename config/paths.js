/* global __dirname, require, module */
const path = require('path');

module.exports = {
  src: path.resolve(__dirname, '../src'),

  build: path.resolve(__dirname, '../dist'),

  examples: path.resolve(__dirname, '../examples'),

  docs: path.resolve(__dirname, '../docs'),
};
