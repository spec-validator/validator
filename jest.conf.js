module.exports = {
  roots: ['<rootDir>/validator/src'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    build: {
      config: {},
    },
    'ts-jest': {
      allowSyntheticDefaultImports: true,
      isolatedModules: true,
      diagnostics: false,
    },
  },

  testEnvironment: 'node',
  testMatch: ['<rootDir>/validator/src/**/*.spec.ts'],
  testURL: 'http://localhost/',

  collectCoverage: true,
  coverageReporters: ['json', 'json-summary', 'lcov'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['validator/src/**/*.{ts}', '!validator/src/**/*.{spec.ts}'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
