import { Task } from 'just-task'
import path from 'path'

import { getGraph, getProjectsPathsInBuildOrder, getWorkspaceInfo } from './buildOrder'
import { write } from './readAndWrite'

const generateRootConfig = (): void => {
  const paths = getProjectsPathsInBuildOrder()

  write('tsconfig.build.json', {
    'extends': './tsconfig.json',
    'compilerOptions': {
      'noEmit': true,
    },
    'references': paths.map(path => ({
      'path': `${path}/tsconfig.build.json`,
    })),
  })
}

const getPathGraph = (): Record<string, string[]> => {
  const info = getWorkspaceInfo()
  return Object.entries(getGraph()).map(
    ([parent, children]) => [
      info[parent].location,
      children.map(child => info[child].location),
    ]
  ) as unknown as Record<string, string[]>
}

const relativePath = (parent: string, child: string) => {
  const count = path.posix.normalize(parent).split('/').length - 1
  const dots = []
  for (let i=0; i< count; i++) {
    dots.push('..')
  }
  dots.push(child)
  return dots.join('/')
}

const generateProjectConfigs = (): void => {
  const graph = getPathGraph()

  Object.entries(graph).forEach(([parent, children]) => {
    write(`${parent}/tsconfig.build.json`, {
      'extends': './tsconfig.json',
      'compilerOptions': {
        'composite': true,
      },
      'exclude': ['src/**/*.spec.ts', 'src/**/*.test.ts'],
      'references': children.map(child => (
        { 'path': `${relativePath(parent, child)}/tsconfig.build.json` }
      )),
    })
  })

}

export default (): Task => async () => {
  generateProjectConfigs()
  generateRootConfig()
}
