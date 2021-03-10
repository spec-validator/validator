import { removePrefix, flatMap } from '@spec-validator/utils/utils'

import glob from 'glob'
import copyRec from './copyRec'

import { read } from './readAndWrite'

export default (projectPath: string): void => {
  const packageJson: Record<string, any>  = read(`${projectPath}/package.json`)

  const files: string[] = packageJson.files || []

  flatMap(
    files.map(it => glob.sync(`${projectPath}/${it}`)),
  ).forEach(src => {
    const relPath = removePrefix(src, `${projectPath}/`)
    const dest = `${projectPath}/dist/${relPath}`
    copyRec(src, dest)
  })
}
