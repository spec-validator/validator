import { task, series, parallel } from 'just-task'
import { forAll as forAllPackages } from './build/buildOrder'

import exec from './build/exec'
import generatePackageJson, { getParentPackageJson } from './build/generatePackageJson'

const lint = (...extras: string[]) =>
  exec('eslint', '--config', '.eslintrc.json', '--ignore-path', '.gitignore', '\'./**/*.ts\'', ...extras)

task('build', series(
  exec('yarn', 'tsc', '--build', 'tsconfig.build.json'),
  parallel(...forAllPackages(generatePackageJson))
))

task('test',
  exec('jest', '--config', './jest.conf.js', '--passWithNoTests', '--detectOpenHandles')
)

task('lint', lint())

task('fmt', lint('--fix'))

task('start-demo', exec('yarn', 'ts-node-dev', '-r', 'tsconfig-paths/register', 'example/run.ts'))

task('clean', parallel(
  ...forAllPackages(
    (path: string) => exec('yarn', 'tsc', '--build', `${path}/tsconfig.build.json`, '--clean'),
    (path: string) => exec('rm', '-f', `${path}/tsconfig.build.tsbuildinfo`),
    (path: string) => exec('rm', '-rf', `${path}/dist`)
  ),
  exec('rm', '-f', 'tsconfig.build.tsbuildinfo')
))

task('publish', parallel(...forAllPackages(
  (path: string) => exec('yarn', 'publish', `${path}/dist`, '--new-version', getParentPackageJson().version)
)))

task('all', series(
  exec('yarn', 'install'),
  'clean',
  'lint',
  'test',
  'build',
))
