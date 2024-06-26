/* global __dirname */
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
// import babel from 'vite-plugin-babel';

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

  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8', // 'istanbul' or 'v8'
      exclude: [
        ...configDefaults.exclude,
        '_notes/**',
        'config/**',
        'docs/**',
        'test/*.bench.*',
        '.eslintrc.js',
      ],
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

  plugins: [
    // babel(),
    banner(bannerText),
  ],
});
