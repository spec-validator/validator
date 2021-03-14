
import { task } from 'just-task'

import * as doJustTaskDefinitions from '@spec-validator/private-build-scripts/justConfig'
import assert from 'assert'

assert(doJustTaskDefinitions)

task('start-demo', doJustTaskDefinitions.exec(
  'yarn', 'ts-node', '-r', 'tsconfig-paths/register', 'example/run.ts'
))
