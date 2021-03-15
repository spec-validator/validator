
import { getPackageNamesInBuildOrder } from './buildOrder'
import { read, write } from './readAndWrite'
import getGitVersion from './getGitVersion'
import { TaskFunction } from 'undertaker'
import { keys } from '@spec-validator/utils/utils'

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
export default (projectPath: string): TaskFunction => async () => {
  const parentConfig: Record<string, any> = read('package.json')
  const packageJson: Record<string, any> = read(`${projectPath}/package.json`)
  const version: string = getGitVersion()
  const workspacePackages = new Set(getPackageNamesInBuildOrder())

  write(`${projectPath}/dist/package.json`, {
    ...Object.fromEntries([
      ...Object.entries(packageJson).filter(it => !EXCLUDE.has(it[0])),
      ...COPY_FROM_PARENT.filter(key => parentConfig[key]).map(key =>
        [key, parentConfig[key]]
      ),
      ...keys(packageJson.dependencies).filter(it => workspacePackages.has(it)).map(it =>
        [it, version]
      ),
    ]),
    private: packageJson.private || false,
    version,
  })
}
