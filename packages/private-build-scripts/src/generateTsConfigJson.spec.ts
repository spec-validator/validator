import generatePackageJson from './generatePackageJson'

const write = jest.fn()

jest.mock('./readAndWrite', () => ({
  write: (path: string, data: any) => write(path, data),
  __esModule: true,
}))

jest.mock('./buildOrder', () => ({
  getPackageNamesInBuildOrder: () => ['pkg1', 'pkg2'],
  __esModule: true,
}))

test('generatePackageJson', async () => {
  const run = generatePackageJson('parent') as any
  await run()
  expect(write.mock.calls[0]).toMatchSnapshot()
})
