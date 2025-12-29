/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
    ],
    '\\.jsx?$': [
      'ts-jest',
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@cto.af|cbor2))',
  ],
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