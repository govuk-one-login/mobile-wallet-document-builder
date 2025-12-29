/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

process.env['DOCUMENTS_TABLE_NAME'] = 'testTable';
process.env['PHOTOS_BUCKET_NAME'] = 'testBucket';

export default {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest'
    ],
  },
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: 'results', outputName: 'report.xml' }]
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**',
  ],
  "coveragePathIgnorePatterns": [
    "/types/",
    "<rootDir>/src/server.ts"
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['**/*.test.ts'],
  testEnvironment: 'node',
  clearMocks: true
}