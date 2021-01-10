import { task, series, parallel } from 'just-task'
import { forAll } from './build/buildOrder'

import exec from './build/exec'
import generatePackageJson from './build/generatePackageJson'

const lint = async (...extras: string[]) => {
  exec('eslint', '--config', '.eslintrc.json', '--ignore-path', '.gitignore', '\'./**/*.ts\'', ...extras)
}

task('build', series(
  () => exec('yarn', 'tsc', '--build', 'tsconfig.build.json'),
  parallel(...forAll(generatePackageJson))
))

task('test', async () => {
  exec('jest', '--config', './jest.conf.js', '--passWithNoTests', '--detectOpenHandles')
})

task('lint', series(
  ...forAll(async (name: string) => {
    exec('yarn', 'tsc', '--noEmit', '--project', `${name}/tsconfig.build.json`)
  }),
  () => lint()
))

task('fmt', () => lint('--fix'))

task('start-demo', () => {
  exec('yarn', 'ts-node-dev', '-r', 'tsconfig-paths/register', 'example/run.ts')
})

task('clean', parallel(
  ...forAll(async (name: string) => {
    exec('yarn', 'tsc', '--build', `${name}/tsconfig.build.json`, '--clean')
    exec('rm', '-f', `${name}/tsconfig.build.tsbuildinfo`)
    exec('rm', '-rf', `${name}/dist`)
  }),
  () => {
    exec('rm', '-f', 'tsconfig.tsbuildinfo')
    exec('rm', '-f', 'tsconfig.build.tsbuildinfo')
  }
))

task('all', series(
  () => exec('yarn', 'install'),
  'clean',
  'lint',
  'test',
  'build'
))
