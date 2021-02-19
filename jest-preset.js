'use strict';

module.exports = {
  coverageProvider: 'v8',
  testEnvironment: `${__dirname}/adonis-environment.js`,
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/build/'],
  transform: {
    '\\.m?[jt]sx?$': `${__dirname}/transformer.js`,
  },
};
