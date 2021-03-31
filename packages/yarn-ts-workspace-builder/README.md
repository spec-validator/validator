# @spec-validator/yarn-ts-workspace-builder

A set of command-line tools to build TS code organized within yarn workspaces

- `yarn build` = produces `dist` build within each workspace package
- `yarn clean` = removes all `build` artifacts
- `yarn publish` = publishes `dist` builds to `publishConfig.registry` defined in root `package.json`

## Rationale

Existing build tools focus exclusively on bundling and building artifacts for frontend services.

There is absolutely nothing that works smoothly out of the box for crafting libraries.

This is a very specialized solution to do exactly that.
