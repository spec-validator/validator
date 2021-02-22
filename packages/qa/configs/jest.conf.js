const fs = require('fs')

const readTsConfig = () => fs.readFileSync('./tsconfig.json')

const mapKey = (key) => key.replace('*', '(.*)')

const mapValue = (value) => value.replace('*', '$1')

const getModuleNameMapper = () => {
  const config = JSON.parse(readTsConfig())
  const baseUrl = config.compilerOptions.baseUrl.replace('./', '<rootDir>/')
  const result = {}
  Object.entries(config.compilerOptions.paths).forEach(([key, value]) => {
    result[mapKey(key)] = baseUrl + '/' + mapValue(value[0])
  })
  return result
}

const pkgs = '<rootDir>/packages'

const srcs = `${pkgs}/**/src/**`

const testsPattern = `${srcs}/*.spec.ts`

module.exports = {
  rootDir: process.cwd(),
  roots: [pkgs],
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

  modulePathIgnorePatterns: ['dist'],

  testEnvironment: 'node',
  testMatch: [testsPattern],
  testURL: 'http://localhost/',

  moduleNameMapper: getModuleNameMapper(),

  collectCoverage: true,
  coverageReporters: ['json', 'json-summary', 'lcov'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    `${srcs}/*.ts`,
    `!${testsPattern}`,
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
}
