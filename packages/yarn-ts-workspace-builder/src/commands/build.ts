import { Command } from 'commander'

import { exec } from '@spec-validator/cli'

import { forAll as forAllPackages } from '../buildOrder'
import generatePackageJson from '../generatePackageJson'
import generateTsConfigJson from '../generateTsConfigJson'
import syncPackageFiles from '../syncPackageFiles'

const run = (baseTsConfig: string, version: string): void => {
  generateTsConfigJson(baseTsConfig)
  exec('yarn', 'tsc', '--build', 'tsconfig.build.json'),
  forAllPackages((path: string) => generatePackageJson(path, version))
  forAllPackages(syncPackageFiles)
}

export default run

const main = (): void => {
  const program = new Command()

  program
    .option('-c, --config', 'base TS config')
    .option('-v, --version', 'build version')

  program.parse(process.argv)

  const options = program.opts()

  run(options.config, options.version)
}

if (require.main === module) {
  main()
}
