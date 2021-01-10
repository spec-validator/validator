import { task, series, Task, parallel } from 'just-task'

import exec from './build/exec'
import generatePackageJsonRaw from './build/generatePackageJson'

const getProjectsInBuildOrder = (): string[] => [
  'packages/validator',
  'packages/rest-api-server',
  'packages/open-api-endpoint',
]

const forAll = (item: (name: string) => Promise<void>): Task[] =>
  getProjectsInBuildOrder().map(it => item.bind(null, it))

const lint = async (...extras: string[]) => {
  exec('eslint', '--config', '.eslintrc.json', '--ignore-path', '.gitignore', '\'./**/*.ts\'', ...extras)
}

task('build', series(
  () => exec('yarn', 'tsc', '--build', 'tsconfig.build.json'),
  parallel(...forAll(async (name: string) => {
    generatePackageJsonRaw(
      __dirname,
      name,
      '@validator'
    )
  }))
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
  }),
  ...forAll(async (name: string) => {
    exec('rm', '-f', `${name}/tsconfig.build.tsbuildinfo`)
  })
))

task('all', series(
  () => exec('yarn', 'install'),
  'clean',
  'lint',
  'test',
  'build'
))
