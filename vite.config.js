/* global __dirname */
import { resolve } from 'path';
import { defineConfig } from 'vite';

import banner from 'vite-plugin-banner';
import pkg from './package.json';

const bannerText = `/*!
* BirthdayPicker v${pkg.version}
* ${pkg.homepage}
*/`;

export default defineConfig({
  build: {
    target: 'es2015', // esnext
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'BirthdayPicker',
      fileName: (format) => {
        format = 'es' === format ? '' : `.${format}`;
        return `birthdaypicker${format}.js`;
      },
    },
  },

  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, 'src'),
      },
    ],
  },

  plugins: [banner(bannerText)],
});
