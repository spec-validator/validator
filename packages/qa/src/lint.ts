#!/usr/bin/env node

/* istanbul ignore file */

import main from './baseLint'

if (require.main === module) {
  main()
}
