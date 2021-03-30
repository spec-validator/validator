import { cached } from '@spec-validator/utils/utils'

import dfs from './dfs'
import { getOutput } from '@spec-validator/cli'

type PackageName = string

export const getWorkspaceInfo = (): Record<PackageName, {
  location: string,
  workspaceDependencies: PackageName[]
}> => cached(
  'workspaceInfo',
  () => JSON.parse(getOutput('yarn', 'workspaces', 'info').toString())
)

export const getGraph = (): Record<string, string[]> => Object.fromEntries(Object.entries(
  getWorkspaceInfo()
).map(([parent, config]) => [parent, (config as any).workspaceDependencies]))

export const getPackageNamesInBuildOrder = (): string[] => dfs(getGraph())

export const getProjectsPathsInBuildOrder = (): string[] => {
  const info = getWorkspaceInfo()
  return getPackageNamesInBuildOrder().map(name => info[name].location)
}

export const forAll = (run: (path: string) => void): void => getProjectsPathsInBuildOrder().forEach(path => {
  run(path)
})
