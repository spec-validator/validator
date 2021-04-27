#!/usr/bin/env node

/* istanbul ignore file */

import { Command } from 'commander'

import { exec, findFolderWith} from '@spec-validator/cli'

const run = (options: {
  update?: boolean,
  pattern?: string,
  bail?: boolean
}): void => {
  exec(
    'jest', '--config', `${findFolderWith('package.json', __dirname)}/configs/jest.conf.js`,
    '--passWithNoTests', '--detectOpenHandles',
    ...(options.update ? ['-u'] : []),
    ...(options.pattern ? ['--coverage', 'false', options.pattern] : []),
    ...(options.bail ? ['-b'] : [])
  )
}

const main = (): void => {
  const program = new Command()

  program
    .option('-u, --update', 'update snapshots')
    .option('-p, --pattern', 'pattern for tests')
    .option('-b, --bail', 'stop on first failure')

  program.parse(process.argv)

  const options = program.opts()

  run(options)
}

export default run

if (require.main === module) {
  main()
}
