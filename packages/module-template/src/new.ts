/* istanbul ignore file */

import fs from 'fs'

import { Command } from 'commander'

import { exec } from '@spec-validator/cli'

const INTERNAL_TPL_DIR = `${__dirname}/internal-templates`

// eslint-disable-next-line max-statements
const run = (): void => {
  const program = new Command()
  program
    .option('-n, --name <name>', 'module name')
    .option('-t, --type <type>', 'module type', '')

  program.parse(process.argv)

  const options = program.opts()

  const types = fs.readdirSync(INTERNAL_TPL_DIR, {withFileTypes: true})
    .filter(item => item.isDirectory())
    .map(item => item.name)

  const type = options.type || 'package'
  if (types.indexOf(type) < 0) {
    throw `Invalid --type. Must be on of: ${types.join('|')}`
  }

  const name = options.name
  if (!name) {
    throw 'Define package --name'
  }

  exec(
    'plop', '--plopfile', `${INTERNAL_TPL_DIR}/${type}/plopfile.js`,
    'package', '--', '--name', name
  )
}

export default run

if (require.main === module) {
  run()
}
