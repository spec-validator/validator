
import { task } from 'just-task'

import exec from '@spec-validator/private-build-scripts/exec'

// eslint-disable-next-line unused-imports/no-unused-imports-ts
import * as doJustTaskDefinitions from '@spec-validator/private-build-scripts/justConfig'

const tsNode = (script: string, isSrv=false) =>
  ['yarn', isSrv ? 'ts-node-dev' : 'ts-node', '-r', 'tsconfig-paths/register', script]

task('start-demo', exec(...tsNode('example/run.ts', true)))
