export default {
  transform: {
    "^.+\\.tsx?$": ["ts-jest"],
  },
  extensionsToTreatAsEsm: [".ts"],
  preset: "ts-jest/presets/default-esm",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  reporters: [
    "default",
    ["jest-junit", { outputDirectory: "results", outputName: "report.xml" }],
  ],
  collectCoverage: true,
  collectCoverageFrom: ["src/**"],
  coveragePathIgnorePatterns: ["/types/", "<rootDir>/src/server.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testMatch: ["**/*.test.ts"],
  testEnvironment: "node",
  clearMocks: true,
};
