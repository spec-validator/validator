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
    'references': paths.map(it => ({
      'path': `${it}/tsconfig.build.json`,
    })),
  })
}

const relativePath = (parent: string, child: string) => {
  const count = path.posix.normalize(parent).split('/').length
  const dots = []
  for (let i=0; i< count; i++) {
    dots.push('..')
  }
  dots.push(child)
  return dots.join('/')
}


const getPathGraph = (): Record<string, string[]> => {
  const info = getWorkspaceInfo()
  return Object.entries(getGraph()).map(
    ([parent, children]) => [
      info[parent].location,
      children.map(child => relativePath(parent, info[child].location)),
    ]
  ) as unknown as Record<string, string[]>
}

const generateProjectConfigs = (): void => {
  const graph = getPathGraph()

  console.log(graph)

  Object.entries(graph).forEach(([parent, children]) => {
    write(`${parent}/tsconfig.build.json`, {
      'extends': './tsconfig.json',
      'compilerOptions': {
        'composite': true,
      },
      'exclude': ['src/**/*.spec.ts', 'src/**/*.test.ts'],
      'references': children.map(child => (
        { 'path': `${child}/tsconfig.build.json` }
      )),
    })
  })

}

export default (): Task => async () => {
  generateProjectConfigs()
  generateRootConfig()
}
