import generateTsConfigJson from './generateTsConfigJson'

const write = jest.fn()

jest.mock('./relPath', () => ({
  default: (parent: string, child: string) =>
    child ? `../../${child}` : `./${parent}`,
  __esModule: true,
}))

jest.mock('./readAndWrite', () => ({
  write: (path: string, data: any) => write(path, data),
  __esModule: true,
}))

jest.mock('./buildOrder', () => ({
  getProjectsPathsInBuildOrder: () => ['pkg1', 'pkg2'],
  getGraph: () => ({
    'pkg1': ['pkg2'],
    'pkg2': [],
  }),
  __esModule: true,
}))

test('generateTsConfigJson', async () => {
  const run = generateTsConfigJson('./root/tsconfig.json') as any
  await run()
  expect(write.mock.calls).toMatchSnapshot()
})
