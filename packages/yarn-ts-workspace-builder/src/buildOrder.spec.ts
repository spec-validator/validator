import {
  getWorkspaceInfo,
  getGraph,
  getPackageNamesInBuildOrder,
  getProjectsPathsInBuildOrder,
  forAll,
} from './buildOrder'

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

jest.mock('@spec-validator/cli', () => ({
  getOutput: () => JSON.stringify(WORKSPACE_INFO),
  __esModule: true,
}))

test('getWorkspaceInfo', () => {
  expect(getWorkspaceInfo()).toEqual(WORKSPACE_INFO)
})

test(
  'getGraph',
  () => expect(getGraph()).toMatchSnapshot()
)

test(
  'getPackageNamesInBuildOrder',
  () => expect(getPackageNamesInBuildOrder()).toMatchSnapshot()
)

test(
  'getProjectsPathsInBuildOrder',
  () => expect(getProjectsPathsInBuildOrder()).toMatchSnapshot()
)

test('forAll', () => {
  const results: string[] = []
  forAll(
    path => { results.push(`${path} one`) },
  )
  expect(results).toMatchSnapshot()
})
