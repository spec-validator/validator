import fs from 'fs'
import path from 'path'

import { mocked } from 'ts-jest/utils'

import copyRec from './copyRec'

jest.mock('fs', () => ({
  default: jest.fn(),
}))

jest.mock('path', () => ({
  default: jest.fn(),
}))

const fsMocked = mocked(fs)
const pathMocked = mocked(path)

test('file', () => {
  copyRec('src', 'trg')
})

test('directory', () => {
  copyRec('src', 'trg')
})
