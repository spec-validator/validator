import { existsSync } from 'fs'

import { mocked } from 'ts-jest/utils'

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}))

const existsSyncMocked = mocked(existsSync)

import findJsProjectRoot from './findJsProjectRoot'

test('returns a project path if there is package.json in the parent chain', () => {
  existsSyncMocked.mockImplementation(path => path === '/repos/project/package.json')
  expect(findJsProjectRoot('/repos/project/src')).toEqual('/repos/project')
})

test('returns undefined if there is no package.json in the parent chain', () => {
  existsSyncMocked.mockImplementation(() => false)
  expect(findJsProjectRoot('/repos/project/src')).toEqual(undefined)
})
