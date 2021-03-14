import { Task } from 'just-task'

import { getPackageNamesInBuildOrder } from './buildOrder'
import { read, write } from './readAndWrite'
import getGitVersion from './getGitVersion'

const EXCLUDE = new Set(['devDependencies', 'files'])
const COPY_FROM_PARENT = [
  'license',
  'author',
  'publishConfig',
  'repository',
  'bugs',
  'homepage',
]


// eslint-disable-next-line max-statements
export default (projectPath: string): Task => async () => {
  const parentConfig: Record<string, any> = read('package.json')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const packageJson: Record<string, any> = read(`${projectPath}/package.json`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPackageJson: Record<string, any> = Object.fromEntries(
    Object.entries(packageJson).filter(it => !EXCLUDE.has(it[0]))
  )

  COPY_FROM_PARENT.forEach(key => {
    if (parentConfig[key]) {
      newPackageJson[key] = parentConfig[key]
    }
  })

  const version: string = getGitVersion()

  newPackageJson.private = packageJson.private || false
  newPackageJson.version = version

  const workspacePackages = new Set(getPackageNamesInBuildOrder())

  if (newPackageJson.dependencies) {
    Object.keys(newPackageJson.dependencies).filter(it => workspacePackages.has(it)).forEach(it => {
      newPackageJson.dependencies[it] = version
    })
  }

  write(`${projectPath}/dist/package.json`, newPackageJson)
}
