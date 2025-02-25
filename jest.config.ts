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
    'src/**',
    '!./jest.config.ts'
  ],
  coveragePathIgnorePatterns: [
    "/types/",
    "src/server.ts",
    // "./jest.config.ts",
    // "./babel.config.json"
  ],

  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/(?!jose).+\\.js$',
  ],
}