module.exports = {
  roots: ['<rootDir>/packages'],
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
  testMatch: ['<rootDir>/packages/**/src/**/*.spec.ts'],
  testURL: 'http://localhost/',

  collectCoverage: true,
  coverageReporters: ['json', 'json-summary', 'lcov'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['packages/**/src/**/*.{ts}', '!packages/**/src/**/*.{spec.ts}'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
}
