import generatePackageJson from './generatePackageJson'

const write = jest.fn()

jest.mock('./readAndWrite', () => ({
  write: (path: string, data: any) => write(path, data),
  read: (path: string) => {
    if (path === 'package.json') {
      return {
        'license': 'Apache-2.0',
        'author': {
          'name': 'Anton Berezin',
          'email': 'gurunars@gmail.com',
          'url': 'https://gurunars.com',
        },
        'homepage': 'https://github.com/spec-validator/validator',
        'bugs': {
          'url': 'https://github.com/spec-validator/validator/issues',
        },
        'publishConfig': {
          'registry': 'https://registry.npmjs.org/',
        },
        'repository': {
          'url': 'https://github.com/spec-validator/validator.git',
          'type': 'git',
        },
      }

    } else {
      return {
        'name': 'child-package',
        'version': '0.0.1',
        'dependencies': {
          'pkg1': '0.0.1',
          'pkg2': '0.0.1',
          '3rd-party': '6.6.6',
        },
      }
    }
  },
  __esModule: true,
}))

jest.mock('./buildOrder', () => ({
  getPackageNamesInBuildOrder: () => ['pkg1', 'pkg2'],
  __esModule: true,
}))

test('generatePackageJson', async () => {
  const run = generatePackageJson('parent', '1.1.1') as any
  await run()
  expect(write.mock.calls[0]).toMatchSnapshot()
})
