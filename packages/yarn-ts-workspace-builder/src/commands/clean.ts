import { Command } from 'commander'

import { exec } from '@spec-validator/cli'

import { forAll as forAllPackages } from '../buildOrder'
import generateTsConfigJson, { DIST } from '../generateTsConfigJson'

const run = (
  baseTsConfig?: string
): void => {
  generateTsConfigJson(baseTsConfig)
  forAllPackages(path => {
    exec('yarn', 'tsc', '--build', `${path}/tsconfig.build.json`, '--clean'),
    exec('rm', '-f', `${path}/tsconfig.build.tsbuildinfo`),
    exec('rm', '-f', `${path}/tsconfig.tsbuildinfo`),
    exec('rm', '-rf', `${path}/${DIST}`)
  })
  exec('rm', '-f', 'tsconfig.build.tsbuildinfo'),
  exec('rm', '-f', 'tsconfig.tsbuildinfo')
  forAllPackages(
    path => exec('rm', '-f', `${path}/tsconfig.build.json`),
  ),
  exec('rm', '-f', 'tsconfig.build.json')
}

export default run

const main = (): void => {
  const program = new Command()

  program
    .option('-c, --config', 'base TS config')

  program.parse(process.argv)

  const options = program.opts()

  run(options.config)
}

if (require.main === module) {
  main()
}
