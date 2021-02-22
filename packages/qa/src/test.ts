#!/usr/bin/env node

/* istanbul ignore file */

import { Command } from 'commander'

import { exec, findJsProjectRoot} from '@spec-validator/cli'

const main = (): void => {
  const program = new Command()

  program
    .option('-u, --update', 'update snapshots')
    .option('-p, --pattern', 'pattern for tests')

  program.parse(process.argv)

  const options = program.opts()

  exec(
    'jest', '--config', `${findJsProjectRoot(__dirname)}/configs/jest.conf.js`,
    '--passWithNoTests', '--detectOpenHandles',
    ...(options.update ? ['-u'] : []),
    ...(options.pattern ? ['--coverage', 'false', options.pattern] : []),
  )
}

if (require.main === module) {
  main()
}
