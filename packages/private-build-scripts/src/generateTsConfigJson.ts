import { flatMap } from '@spec-validator/utils/utils'
import { Task } from 'just-task'
import { getGraph, getProjectsPathsInBuildOrder } from './buildOrder'
import { write } from './readAndWrite'
import getRelativePath from './relPath'

export const DIST = 'dist'

const generateRootConfig = (baseTsConfig: string): void =>
  write('tsconfig.build.json', {
    'extends': baseTsConfig,
    'compilerOptions': {
      'noEmit': true,
    },
    'references': getProjectsPathsInBuildOrder().map(it => ({
      'path': `${it}/tsconfig.build.json`,
    })),
  })

const generateProjectConfigs = (baseTsConfig: string): void =>
  Object.entries(getGraph()).forEach(([parent, children]) => {
    write(`${getRelativePath(parent)}/tsconfig.build.json`, {
      'extends': baseTsConfig,
      'compilerOptions': {
        'baseUrl': './',
        'composite': true,
        'noEmit': false,
        'rootDir': './src',
        'outDir': `./${DIST}`,
        'paths': Object.fromEntries(flatMap(
          children.map(child => [
            getRelativePath(parent, child),
            child,
          ]).map(([rel, child]) => [
            [child, [`${rel}/src/index.ts`]],
            [`${child}/*`, [`${rel}/src/*`]],
          ]))),
      },
      'include': ['src/**/*.ts'],
      'exclude': ['src/**/*.spec.ts', 'src/**/*.test.ts'],
      'references': children.map(child => (
        { 'path': `${getRelativePath(parent, child)}/tsconfig.build.json` }
      )),
    })
  })

export default (baseTsConfig: string): Task => async () => {
  generateProjectConfigs(baseTsConfig)
  generateRootConfig(baseTsConfig)
}
