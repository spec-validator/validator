import fs from 'fs'

import { task, series, parallel, option, argv } from 'just-task'

import { forAll as forAllPackages } from '@spec-validator/private-build-scripts/buildOrder'
import exec from '@spec-validator/private-build-scripts/exec'
import generatePackageJson from '@spec-validator/private-build-scripts/generatePackageJson'
import generateTsConfigJson from '@spec-validator/private-build-scripts/generateTsConfigJson'
import testDocs from '@spec-validator/doc-tester/runCodeBlocks'

const INTERNAL_TPL_DIR = 'packages/private-build-scripts/internal-templates'

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

const tsNode = (script: string, isSrv=false) =>
  ['yarn', isSrv ? 'ts-node-dev' : 'ts-node', '-r', 'tsconfig-paths/register', script]

task('test',
  async (): Promise<void> => {
    option('-u', { default: false } as any)
    option('-p', { default: undefined } as any)
    const call = exec(...tsNode('packages/qa/src/test.ts'),
      ...(argv().u ? ['-u'] : []),
      ...(argv().p ? ['-p', argv().p] : []),
    ) as unknown as (() => Promise<void>)
    return await call()
  }
)

task('lint', exec(...tsNode('packages/qa/src/lint.ts')))

task('fmt', exec(...tsNode('packages/qa/src/fmt.ts')))

task('start-demo', exec(...tsNode('example/run.ts', true)))

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
