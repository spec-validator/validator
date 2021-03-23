#!/usr/bin/env node

/* istanbul ignore file */

import baseLint from './baseLint'

const main = (): void => {
  baseLint('--fix')
}

export default main

if (require.main === module) {
  main()
}
