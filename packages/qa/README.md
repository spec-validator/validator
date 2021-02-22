# @spec-validator/qa

A set of command-line tools to work on quality assurance.

- `yarn lint` = run `eslint` checks and `tsc` in `--noEmit` mode to validate code syntactically
- `yarn fmt` = attempt to auto-resolve syntax issues highlighted by `lint`
- `yarn test` = run jest based unit tests with code coverage with 90% min percentage
