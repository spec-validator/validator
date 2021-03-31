import { existsSync } from 'fs'

import { mocked } from 'ts-jest/utils'

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}))

const existsSyncMocked = mocked(existsSync)

import findFolderWith from './findFolderWith'

test('returns a project path if there is package.json in the parent chain', () => {
  existsSyncMocked.mockImplementation(path => path === '/repos/project/package.json')
  expect(findFolderWith('package.json', '/repos/project/src')).toEqual('/repos/project')
})

test('returns undefined if there is no package.json in the parent chain', () => {
  existsSyncMocked.mockImplementation(() => false)
  expect(() => findFolderWith('package.json', '/repos/project/src'))
    .toThrowError('Could not find a directory with package.json in /repos/project/src and up.')
})
