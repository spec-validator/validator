
import { exec } from '@spec-validator/cli'

import { forAll as forAllPackages } from '../buildOrder'
import generatePackageJson from '../generatePackageJson'
import generateTsConfigJson from '../generateTsConfigJson'
import syncPackageFiles from '../syncPackageFiles'
import getGitVersion from '../getGitVersion'


const main = (): void => {
  generateTsConfigJson()
  exec('yarn', 'tsc', '--build', 'tsconfig.build.json'),
  forAllPackages((pt: string) => generatePackageJson(pt, getGitVersion()))
  forAllPackages(syncPackageFiles)
}

export default main

if (require.main === module) {
  main()
}
