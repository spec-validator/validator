import relPath from './relPath'

const WORKSPACE_INFO = {
  'pkg1': {
    location: './pkg1',
    workspaceDependencies: [],
  },
  'pkg2': {
    location: './pkg2',
    workspaceDependencies: ['pkg1'],
  },
  'pkg3': {
    location: './pkg3',
    workspaceDependencies: ['pkg2'],
  },
  'pkg4': {
    location: './pkg4',
    workspaceDependencies: ['pkg3'],
  },
}

jest.mock('./buildOrder', () => ({
  getWorkspaceInfo: () => WORKSPACE_INFO,
  __esModule: true,
}))

test('for parent', () => {
  expect(relPath('pkg1')).toEqual('./pkg1')
})

test('for child', () => {
  expect(relPath('pkg1', 'pkg2')).toEqual('.././pkg2')
})
