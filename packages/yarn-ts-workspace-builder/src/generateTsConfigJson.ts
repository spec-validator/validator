import path from 'path'

import { flatMap } from '@spec-validator/utils/utils'
import { getGraph, getProjectsPathsInBuildOrder } from './buildOrder'
import { write } from './readAndWrite'
import getRelativePath from './relPath'
import { findFolderWith } from '@spec-validator/cli'

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

const getDefaultTsConfig = (): string => path.join(findFolderWith('.git', process.cwd()), 'tsconfig.json')

export default (baseTsConfig?: string): void => {
  baseTsConfig = baseTsConfig || getDefaultTsConfig()
  generateProjectConfigs(baseTsConfig)
  generateRootConfig(baseTsConfig)
}
