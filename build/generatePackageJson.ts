import { Task } from 'just-task'

import * as fs from 'fs'

import { getPackageNamesInBuildOrder } from './buildOrder'

export default (projectPath: string): Task => async () => {
  const { version, license } = JSON.parse(
    fs.readFileSync('package.json').toString()
  )

  const EXCLUDE = new Set(['devDependencies'])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const packageJson: Record<string, any> = JSON.parse(
    fs.readFileSync(`${projectPath}/package.json`).toString()
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPackageJson: Record<string, any> = Object.fromEntries(
    Object.entries(packageJson).filter(it => !EXCLUDE.has(it[0]))
  )

  newPackageJson.version = version
  newPackageJson.license = license

  const workspacePackages = new Set(getPackageNamesInBuildOrder())

  if (newPackageJson.dependencies) {
    Object.keys(newPackageJson.dependencies).filter(it => workspacePackages.has(it)).forEach(it => {
      newPackageJson.dependencies[it] = version
    })
  }

  fs.writeFileSync(
    `${projectPath}/dist/package.json`,
    JSON.stringify(newPackageJson, null, 2)
  )
}
