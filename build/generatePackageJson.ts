import fs from 'fs'
import util from 'util'

import { Task } from 'just-task'

import { getPackageNamesInBuildOrder } from './buildOrder'
import getOutput from './getOutput'
import { read, write } from './readAndWrite'

const EXCLUDE = new Set(['devDependencies'])
const COPY_FROM_PARENT = [
  'license',
  'author',
  'publishConfig',
  'repository',
  'bugs',
  'homepage',
]

const copyFile = util.promisify(fs.copyFile)

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

  let version: string | undefined = ''

  if (process.env.CI) {
    version = getOutput('git', 'tag', '--points-at', 'HEAD').toString()
      .split('\n')
      .find(it => it.match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/))
    if (!version) {
      throw 'Commit doesn\'t point at any semver tag - can\'t publish'
    }
  } else {
    version = getOutput('git', 'describe').toString()
      .split('\n')[0]
  }

  newPackageJson.private = false
  newPackageJson.version = version

  const workspacePackages = new Set(getPackageNamesInBuildOrder())

  if (newPackageJson.dependencies) {
    Object.keys(newPackageJson.dependencies).filter(it => workspacePackages.has(it)).forEach(it => {
      newPackageJson.dependencies[it] = version
    })
  }

  write(`${projectPath}/dist/package.json`, newPackageJson)

  copyFile(`${projectPath}/README.md`, `${projectPath}/dist/README.md`)
}
