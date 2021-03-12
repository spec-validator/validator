import fs from 'fs'

import { mocked } from 'ts-jest/utils'

import copyRec from './copyRec'

jest.mock('fs', () => ({
  default: jest.fn(),
}))

const statSync = mocked(fs.statSync)
const readdirSync = mocked(fs.readdirSync)


test('file', () => {
  statSync.mockReturnValue({
    isDirectory: () => false,
  } as any)
  copyRec('src', 'trg')

  expect(fs.copyFileSync.call.length).toEqual(1)

  expect(fs.mkdirSync.call.length).toEqual(0)
})

test('directory', () => {
  statSync.mockReturnValue({
    isDirectory: () => true,
  } as any)
  readdirSync.mockReturnValue(['child'] as any)
  copyRec('src', 'trg')


  expect(fs.copyFileSync.call.length).toEqual(0)
  expect(fs.mkdirSync.call.length).toEqual(2)
})
