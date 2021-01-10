import { Task } from 'just-task'

import cached from './cached'
import dfs from './dfs'
import flatMap from './flatMap'
import getOutput from './getOutput'

export const getWorkspaceInfo = (): any => cached(
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

export const forAll = (...items: ((name: string) => Task)[]): Task[] => flatMap(
  items.map(item =>
    getProjectsPathsInBuildOrder().map(
      it => item.bind(null, it))
  )
)

