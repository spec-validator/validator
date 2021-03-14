import { Task } from 'just-task'

import { cached, flatMap } from '@spec-validator/utils/utils'

import dfs from './dfs'
import { exec } from '@spec-validator/cli'

type PackageName = string

export const getWorkspaceInfo = (): Record<PackageName, {
  location: string,
  workspaceDependencies: PackageName[]
}> => cached(
  'workspaceInfo',
  () => JSON.parse(exec('yarn', 'workspaces', 'info').toString())
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

