import exec from '@spec-validator/cli/exec'

import { forAll as forAllPackages } from '../buildOrder'
import { DIST } from '../generateTsConfigJson'
import { read } from '../readAndWrite'

const run = (): void => {
  forAllPackages(path => {
    if (read(`${path}/package.json`).private) {
      return
    }
    exec(
      'yarn', 'publish',
      '--non-interactive',
      '--access', 'public',
      `${path}/${DIST}`,
    )
  })
}

export default run

if (require.main === module) {
  run()
}
