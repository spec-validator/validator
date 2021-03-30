import syncPackageFiles from './syncPackageFiles'

const copyFileSync = jest.fn()

jest.mock('fs', () => ({
  copyFileSync: (src: string, trg: string) => copyFileSync(src, trg),
  __esModule: true,
}))

jest.mock('./readAndWrite', () => ({
  read: () => ({
    files: ['file1', 'file2'],
  }),
  __esModule: true,
}))

jest.mock('glob', () => ({
  sync: (path: string) => [path],
  __esModule: true,
}))

const copyRec = jest.fn()

jest.mock('./copyRec', () => ({
  default: (src: string, trg: string) => copyRec(src, trg),
  __esModule: true,
}))

test('sync', () => {
  syncPackageFiles('./project')
  expect(copyFileSync.mock.calls).toMatchSnapshot()
  expect(copyRec.mock.calls).toMatchSnapshot()
})
