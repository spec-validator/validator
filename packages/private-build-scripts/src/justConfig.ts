/* istanbul ignore file */

import fs from 'fs'

import { task, series, option, argv, Task } from 'just-task'

import testDocs from '@spec-validator/doc-tester/runCodeBlocks'

import execSync from '@spec-validator/cli/exec'

import runLint from '@spec-validator/qa/lint'
import runFmt from '@spec-validator/qa/fmt'
import runTest from '@spec-validator/qa/test'

import publish from '@spec-validator/yarn-ts-workspace-builder/commands/publish'
import clean from '@spec-validator/yarn-ts-workspace-builder/commands/clean'
import build from '@spec-validator/yarn-ts-workspace-builder/commands/build'
import getGitVersion from '@spec-validator/yarn-ts-workspace-builder/getGitVersion'

const INTERNAL_TPL_DIR = `${__dirname}/internal-templates`

export const exec = (...cmd: [cmd: string, ...args:string[]]): Task =>
  async () => execSync(...cmd)

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

task('test-docs', () => testDocs())

task('test',
  async (): Promise<void> => {
    option('-u', { default: false } as any)
    option('-p', { default: undefined } as any)
    runTest({
      update: argv().u,
      pattern: argv().p,
    })
  }
)

task('lint', () => runLint())

task('fmt', () => runFmt())

const baseTsConfig = `${__dirname}/../../../tsconfig.json`

task('build', () => build(baseTsConfig, getGitVersion()))

task('clean', () => clean(baseTsConfig))

task('publish', publish)

task('all', series(
  exec('yarn', 'install'),
  'clean',
  'lint',
  'test',
  'test-docs',
  'build',
))
