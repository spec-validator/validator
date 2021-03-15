import { flatMap } from '@spec-validator/utils/utils'
import { Task } from 'just-task'
import { getGraph, getProjectsPathsInBuildOrder } from './buildOrder'
import { write } from './readAndWrite'
import getRelativePath from './relPath'

export const DIST = 'dist'

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

const generateProjectConfigs = (): void => {
  const graph = getGraph()
  Object.entries(graph).forEach(([parent, children]) => {
    write(`${getRelativePath(parent)}/tsconfig.build.json`, {
      'extends': '../../tsconfig.json',
      'compilerOptions': {
        'baseUrl': './',
        'composite': true,
        'noEmit': false,
        'rootDir': './src',
        'outDir': `./${DIST}`,
        'paths': Object.fromEntries(flatMap(children.map(child => {
          const rel = getRelativePath(parent, child)
          return [
            [child, [`${rel}/src/index.ts`]],
            [`${child}/*`, [`${rel}/src/*`]],
          ]
        }))),
      },
      'include': ['src/**/*.ts'],
      'exclude': ['src/**/*.spec.ts', 'src/**/*.test.ts'],
      'references': children.map(child => (
        { 'path': `${getRelativePath(parent, child)}/tsconfig.build.json` }
      )),
    })
  })

}

export default (): Task => async () => {
  generateProjectConfigs()
  generateRootConfig()
}
