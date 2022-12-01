/* global require, module */
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // 'eval-cheap-source-map',

  output: {
    filename: '[name].min.js',
    library: {
      name: 'BirthdayPicker',
      type: 'umd',
      umdNamedDefine: true,
      export: 'default',
    },
    globalObject: 'this',
  },

  // dev server
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    hot: true,
    port: 8080,
    static: paths.examples,
  },
});
