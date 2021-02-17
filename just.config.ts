import fs from 'fs'

import { task, series, parallel, option, argv } from 'just-task'
import { forAll as forAllPackages } from './build/buildOrder'

import exec from './build/exec'
import generatePackageJson from './build/generatePackageJson'
import generateTsConfigJson from './build/generateTsConfigJson'

import testDocs from './packages/doc-tester/src/runCodeBlocks'

const lint = (...extras: string[]) =>
  exec('eslint', '--config', '.eslintrc.json', '--ignore-path', '.gitignore', '\'./**/*.ts\'', ...extras)

const INTERNAL_TPL_DIR = 'build/internal-templates'

task('new',
  // eslint-disable-next-line max-statements
  async (): Promise<void> => {
    option('name')
    option('type')
    const types = fs.readdirSync(INTERNAL_TPL_DIR, {withFileTypes: true})
      .filter(item => item.isDirectory())
      .map(item => item.name)

    const type = argv().type || 'package'
    if (types.indexOf(type) < 0) {
      throw `Invalid --type. Must be on of: ${types.join('|')}`
    }

    const name = argv().name
    if (!name) {
      throw 'Define package --name'
    }

    const call = exec(
      'plop', '--plopfile', `${INTERNAL_TPL_DIR}/${type}/plopfile.js`,
      'package', '--', '--name', name
    ) as unknown as (() => Promise<void>)
    return await call()
  }
)

task('build', series(
  generateTsConfigJson(),
  exec('yarn', 'tsc', '--build', 'tsconfig.build.json'),
  parallel(...forAllPackages(generatePackageJson))
))

task('test-docs', () => testDocs())

task('test',
  async (): Promise<void> => {
    option('-u', { default: false } as any)
    option('-p', { default: undefined } as any)
    const call = exec(
      'jest', '--config', './jest.conf.js', '--passWithNoTests', '--detectOpenHandles',
      ...(argv().u ? ['-u'] : []),
      ...(argv().p ? ['--coverage', 'false', argv().p] : []),
    ) as unknown as (() => Promise<void>)
    return await call()
  }
)

task('lint', lint())

task('fmt', lint('--fix'))

task('start-demo', exec('yarn', 'ts-node-dev', '-r', 'tsconfig-paths/register', 'example/run.ts'))

task('clean', series(
  generateTsConfigJson(),
  parallel(
    ...forAllPackages(
      (path: string) => exec('yarn', 'tsc', '--build', `${path}/tsconfig.build.json`, '--clean'),
      (path: string) => exec('rm', '-f', `${path}/tsconfig.build.tsbuildinfo`),
      (path: string) => exec('rm', '-f', `${path}/tsconfig.tsbuildinfo`),
      (path: string) => exec('rm', '-rf', `${path}/dist`)
    ),
    exec('rm', '-f', 'tsconfig.build.tsbuildinfo'),
    exec('rm', '-f', 'tsconfig.tsbuildinfo')
  ),
  parallel(
    ...forAllPackages(
      (path: string) => exec('rm', '-f', `${path}/tsconfig.build.json`),
    ),
    exec('rm', '-f', 'tsconfig.build.json')
  )
))

task('publish', parallel(...forAllPackages(
  (path: string) => exec(
    'yarn', 'publish',
    '--non-interactive',
    '--access', 'public',
    `${path}/dist`,
  )
)))

task('all', series(
  exec('yarn', 'install'),
  'clean',
  'lint',
  'test',
  'test-docs',
  'build',
))
