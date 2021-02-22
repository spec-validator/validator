#!/usr/bin/env node

/* istanbul ignore file */

import { exec, findJsProjectRoot} from '@spec-validator/cli'

export default (...extras: string[]): void =>
  exec(
    'eslint', '--config', `${findJsProjectRoot(__dirname)}/configs/eslintrc.json`,
    '--ignore-path', '.gitignore', '\'./**/*.ts\'', ...extras
  )
