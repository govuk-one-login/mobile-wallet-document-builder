/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
require('dotenv').config({
  path: './.env.example',
});

export default {
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'results', outputName: 'report.xml' }]
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    './**/*.ts',
    '!./**/types/*.ts',
    '!./jest.config.ts',
    '!./src/server.ts',
  ],
  // coveragePathIgnorePatterns: [
  //   "/types/",
  //   "src/server.ts"
  // ],

  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/(?!jose).+\\.js$',
  ],
}