import { exec } from '@spec-validator/cli'

import { forAll as forAllPackages } from '../buildOrder'
import generateTsConfigJson, { DIST } from '../generateTsConfigJson'

const main = (): void => {
  generateTsConfigJson()
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

export default main

if (require.main === module) {
  main()
}
