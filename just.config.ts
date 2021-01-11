import { task, series, parallel } from 'just-task'
import { forAll as forAllPackages } from './build/buildOrder'

import exec from './build/exec'
import generatePackageJson from './build/generatePackageJson'
import generateTsConfigJson from './build/generateTsConfigJson'
import { read } from './build/readAndWrite'

const lint = (...extras: string[]) =>
  exec('eslint', '--config', '.eslintrc.json', '--ignore-path', '.gitignore', '\'./**/*.ts\'', ...extras)

task('build', series(
  generateTsConfigJson(),
  exec('yarn', 'tsc', '--build', 'tsconfig.build.json'),
  parallel(...forAllPackages(generatePackageJson))
))

task('test',
  exec('jest', '--config', './jest.conf.js', '--passWithNoTests', '--detectOpenHandles')
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
    '--access', 'public',
    `${path}/dist`,
    '--new-version', read('package.json').version
  )
)))

task('all', series(
  exec('yarn', 'install'),
  'clean',
  'lint',
  'test',
  'build',
))
