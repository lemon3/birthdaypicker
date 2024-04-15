// import globals from 'globals';
import js from '@eslint/js';

// console.log(globals.browser);

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        // issue: Global "AudioWorkletGlobalScope " has leading or trailing whitespace.
        // ...globals.browser,

        // fix (define globals)
        document: true,
        CustomEvent: false,
        window: false,
        console: false,
      },
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
    },
    ignores: [
      '!.*',
      'dist',
      'docs',
      '_notes',
      'node_modules',
      'coverage/**/*.*',
      '*.config.js',
    ],
  },
];
