const fs = require('fs')

const readTsConfig = () => fs.readFileSync('./tsconfig.json')

const mapKey = (key) => key.replace('*', '(.*)')

const mapValue = (value) => value.replace('*', '$1')

const getModuleNameMapper = () => {
  const config = JSON.parse(readTsConfig())
  const baseUrl = (config.compilerOptions.baseUrl || '.').replace(/^\./, '<rootDir>')
  const result = {}
  Object.entries(config.compilerOptions.paths || {}).forEach(([key, value]) => {
    result[mapKey(key)] = baseUrl + '/' + mapValue(value[0])
  })
  return result
}

const getSources = () => {
  const config = JSON.parse(readTsConfig())
  const sources = []
  Object.values(config.compilerOptions.paths || {}).forEach((value) => {
    sources.push(value[0])
  })
  return sources
}

module.exports = {
  rootDir: process.cwd(),
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

  modulePathIgnorePatterns: ['dist', 'node_modules'],

  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],

  moduleNameMapper: getModuleNameMapper(),

  collectCoverage: true,
  coverageReporters: ['json', 'json-summary', 'lcov'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: getSources(),
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
}
