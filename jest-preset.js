'use strict';

module.exports = {
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/build/'],
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/build/'],
  transform: {
    '\\.m?[jt]sx?$': `${__dirname}/transformer.js`,
  },
};
