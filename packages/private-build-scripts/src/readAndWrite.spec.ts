import { read, write } from './readAndWrite'

const writeFileSync = jest.fn()

jest.mock('fs', () => ({
  readFileSync: () => JSON.stringify(42),
  writeFileSync: (path: string, data: unknown) => writeFileSync(path, data),
  __esModule: true,
}))



test('read', () => {
  expect(read('path')).toEqual(42)
})

test('write', () => {
  write('path', 42)
  expect(writeFileSync).toBeCalledWith('path', '42')
})
