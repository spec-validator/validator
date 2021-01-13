import { Task } from 'just-task'
import path from 'path'

import { getGraph, getProjectsPathsInBuildOrder, getWorkspaceInfo } from './buildOrder'
import flatMap from './flatMap'
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
  const count = path.posix.normalize(parent).split('/').length - 1
  const dots = []
  for (let i=0; i< count; i++) {
    dots.push('..')
  }
  dots.push(child)
  return dots.join('/')
}

const getRelativePath = (parent: string, child?: string): string => {
  const info = getWorkspaceInfo()
  if (child) {
    return relativePath(info[parent].location, info[child].location.split('/').slice(1).join('/'))
  } else {
    return info[parent].location
  }
}

const generateProjectConfigs = (): void => {
  const graph = getGraph()
  Object.entries(graph).forEach(([parent, children]) => {
    write(`${getRelativePath(parent)}/tsconfig.build.json`, {
      'extends': '../../tsconfig.base.json',
      'compilerOptions': {
        'composite': true,
        'noEmit': false,
        'rootDir': './src',
        'outDir': './dist',
      },
      'include': ['src/**/*.ts'],
      'exclude': ['src/**/*.spec.ts', 'src/**/*.test.ts'],
      'references': children.map(child => (
        { 'path': `${getRelativePath(parent, child)}/tsconfig.build.json` }
      )),
      'paths': Object.fromEntries(flatMap(children.map(child => {
        const rel = getRelativePath(parent, child)
        return [
          [child, `${rel}/src/index.ts`],
          [`${child}/*`, `${rel}/src/*`],
        ]
      }))),
    })
  })

}

export default (): Task => async () => {
  generateProjectConfigs()
  generateRootConfig()
}
