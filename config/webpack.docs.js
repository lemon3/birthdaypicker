/* global require, module */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const paths = require('./paths');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
  },

  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },

  output: {
    path: paths.docs,
    filename: 'js/[name].min.js',
    library: {
      name: 'BirthdayPicker',
      type: 'umd',
      umdNamedDefine: true,
      export: 'default',
    },
    globalObject: 'this',
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'tailwindcss & alpine.js | Demo',
      template: paths.src + '/template.html', // template file
      minify: true,
    }),
  ],
});
