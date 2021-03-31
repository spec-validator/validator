#!/usr/bin/env node

/* istanbul ignore file */

import { exec, findFolderWith} from '@spec-validator/cli'

export default (...extras: string[]): void => {
  exec(
    'eslint', '--config', `${findFolderWith('package.json', __dirname)}/configs/eslintrc.json`,
    '--ignore-path', '.gitignore', '\'./**/*.ts\'', ...extras
  )
}
