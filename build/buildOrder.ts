import { Task } from 'just-task'

import cached from './cached'
import dfs from './dfs'
import getOutput from './getOutput'

const getWorkspaceInfo = () => cached(
  'workspaceInfo',
  () => JSON.parse(getOutput('yarn', 'workspaces', 'info').toString())
)

const getGraph = (): Record<string, string[]> => Object.fromEntries(Object.entries(
  getWorkspaceInfo()
).map(([parent, config]) => [parent, (config as any).workspaceDependencies]))

export const getPackageNamesInBuildOrder = (): string[] => dfs(getGraph())

const getProjectsPathsInBuildOrder = (): string[] => {
  const info = getWorkspaceInfo()
  return getPackageNamesInBuildOrder().map(name => info[name].location)
}

export const forAll = (item: (name: string) => Promise<void>): Task[] =>
  getProjectsPathsInBuildOrder().map(it => item.bind(null, it))
