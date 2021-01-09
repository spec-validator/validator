import { task, series, Task } from 'just-scripts'

import exec from './build/exec'

const getProjectsInBuildOrder = (): string[] => [
  'validator',
  'rest-api-server',
  'open-api-endpoint',
]

const forAll = (item: (name: string) => Promise<void>): Task[] =>
  getProjectsInBuildOrder().map(it => item.bind(null, it))

const compile = async (name: string) => {
  exec('yarn', 'tsc', '--build', `packages/${name}/tsconfig.build.json`)
}

const validateTs = async (name: string) => {
  exec('yarn', 'tsc', '--noEmit', '--project', `packages/${name}/tsconfig.build.json`)
}

const lint = async () => {
  exec('eslint', '--config', '.eslintrc.json', '--ignore-path', '.gitignore', '\'./**/*.ts\'')
}

task('compile', series(...forAll(compile)))

task('test', async () => {
  exec('jest', '--config', './jest.conf.js', '--passWithNoTests', '--detectOpenHandles')
})

task('lint', series(
  ...forAll(validateTs),
  lint,
))
