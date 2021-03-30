import exec from '@spec-validator/cli/exec'

import { forAll as forAllPackages } from '../buildOrder'
import { DIST } from '../generateTsConfigJson'

const run = (): void => {
  forAllPackages(path => {
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
