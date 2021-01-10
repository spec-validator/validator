import { Task } from 'just-task'

import * as fs from 'fs'

import { getPackageNamesInBuildOrder } from './buildOrder'

const EXCLUDE = new Set(['devDependencies'])
const COPY_FROM_PARENT = [
  'version', 'license', 'author', 'publishConfig', 'repository',
]

export default (projectPath: string): Task => async () => {
  const parentConfig = JSON.parse(
    fs.readFileSync('package.json').toString()
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const packageJson: Record<string, any> = JSON.parse(
    fs.readFileSync(`${projectPath}/package.json`).toString()
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPackageJson: Record<string, any> = Object.fromEntries(
    Object.entries(packageJson).filter(it => !EXCLUDE.has(it[0]))
  )

  COPY_FROM_PARENT.forEach(key => {
    newPackageJson[key] = parentConfig[key]
  })

  newPackageJson.private = false

  const workspacePackages = new Set(getPackageNamesInBuildOrder())

  if (newPackageJson.dependencies) {
    Object.keys(newPackageJson.dependencies).filter(it => workspacePackages.has(it)).forEach(it => {
      newPackageJson.dependencies[it] = parentConfig.version
    })
  }

  fs.writeFileSync(
    `${projectPath}/dist/package.json`,
    JSON.stringify(newPackageJson, null, 2)
  )
}
