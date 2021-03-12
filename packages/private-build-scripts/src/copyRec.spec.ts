import fs from 'fs'


import copyRec from './copyRec'

jest.mock('fs', () => ({
  default: jest.fn(),
}))

beforeEach(() => {
  fs.copyFileSync = jest.fn()
  fs.mkdirSync = jest.fn()
})

afterEach(() => jest.clearAllMocks())

test('file', () => {
  fs.statSync = () =>({
    isDirectory: () => false,
  } as any)

  fs.copyFileSync = jest.fn()
  fs.mkdirSync = jest.fn()

  copyRec('src', 'trg')

  expect(fs.copyFileSync).toHaveBeenCalledTimes(1)
  expect(fs.mkdirSync).toHaveBeenCalledTimes(0)
})

test('directory', () => {
  let done = false

  fs.statSync = () =>({
    isDirectory: () => {
      if (done) {
        return false
      } else {
        done = true
        return true
      }
    },
  } as any)
  fs.readdirSync = () => ['child'] as any

  copyRec('src', 'trg')

  expect(fs.copyFileSync).toHaveBeenCalledTimes(1)
  expect(fs.mkdirSync).toHaveBeenCalledTimes(1)
})
