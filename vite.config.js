/* global __dirname */
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import terser from '@rollup/plugin-terser';
// import babel from 'vite-plugin-babel';

import banner from 'vite-plugin-banner';
import pkg from './package.json';

const bannerText = `/*!
* BirthdayPicker v${pkg.version}
* ${pkg.homepage}
*/`;

const footer = `
if (globalThis.getDomData) {
  for (const key of Object.keys(globalThis.getDomData)) {
    globalThis[key] = globalThis.getDomData[key]
  }
}
`;

const terserOptions = {
  format: {
    comments: false,
  },
};

export default defineConfig({
  build: {
    target: 'es2015', // esnext
    // minify: 'terser',
    // terserOptions,
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'BirthdayPicker',
      fileName: (format) => {
        format = 'es' === format ? '' : `.${format}`;
        return `birthdaypicker${format}.js`;
      },
    },
    // copyPublicDir: false,
    rollupOptions: {
      // input: ['./index.html'],
      plugins: [terser(terserOptions)],
      output: { footer },
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
