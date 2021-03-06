import { keys } from '@spec-validator/utils/utils'

import { getPackageNamesInBuildOrder } from './buildOrder'
import { read, write } from './readAndWrite'
import { DIST } from './generateTsConfigJson'

const EXCLUDE = new Set(['devDependencies', 'files'])
const COPY_FROM_PARENT = [
  'license',
  'author',
  'publishConfig',
  'repository',
  'bugs',
  'homepage',
]

export default (projectPath: string, version: string): void => {
  const parentConfig: Record<string, any> = read('package.json')
  const packageJson: Record<string, any> = read(`${projectPath}/package.json`)
  const workspacePackages = new Set(getPackageNamesInBuildOrder())

  write(`${projectPath}/${DIST}/package.json`, {
    ...Object.fromEntries([
      ...Object.entries(packageJson).filter(it => !EXCLUDE.has(it[0])),
      ...COPY_FROM_PARENT.filter(key => parentConfig[key]).map(key =>
        [key, parentConfig[key]]
      ),
    ]),
    dependencies: {
      ...packageJson.dependencies,
      ...Object.fromEntries(
        keys(packageJson.dependencies).filter(it => workspacePackages.has(it)).map(it =>
          [it, version]
        )
      ),
    },
    private: packageJson.private || false,
    version,
  })
}
