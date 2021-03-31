
import { Command } from 'commander'

import { exec } from '@spec-validator/cli'

import { forAll as forAllPackages } from '../buildOrder'
import generatePackageJson from '../generatePackageJson'
import generateTsConfigJson from '../generateTsConfigJson'
import syncPackageFiles from '../syncPackageFiles'
import getGitVersion from '../getGitVersion'


const run = (baseTsConfig?: string): void => {
  generateTsConfigJson(baseTsConfig)
  exec('yarn', 'tsc', '--build', 'tsconfig.build.json'),
  forAllPackages((pt: string) => generatePackageJson(pt, getGitVersion()))
  forAllPackages(syncPackageFiles)
}

export default run

const main = (): void => {
  const program = new Command()

  program.option('-c, --config', 'base TS config', '')

  program.parse(process.argv)

  const options = program.opts()

  run(options.config)
}

if (require.main === module) {
  main()
}
