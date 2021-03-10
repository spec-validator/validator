import fs from 'fs'

import { task, series, parallel, option, argv } from 'just-task'

import testDocs from '@spec-validator/doc-tester/runCodeBlocks'

import runLint from '@spec-validator/qa/lint'
import runFmt from '@spec-validator/qa/fmt'
import runTest from '@spec-validator/qa/test'

import { forAll as forAllPackages } from './buildOrder'
import exec from './exec'
import generatePackageJson from './generatePackageJson'
import generateTsConfigJson from './generateTsConfigJson'

const INTERNAL_TPL_DIR = `${__dirname}/private-build-scripts/internal-templates`

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
    runTest({
      update: argv().u,
      pattern: argv().p,
    })
  }
)

task('lint', () => runFmt())

task('fmt', () => runLint())

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
