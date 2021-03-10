#!/usr/bin/env node

/* istanbul ignore file */

import main from './baseLint'

export default main

if (require.main === module) {
  main('--fix')
}
