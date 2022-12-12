/* global module */

const config = {
  verbose: true,
  modulePaths: ['src'],
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    // alias
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '_notes'],
};

module.exports = config;
