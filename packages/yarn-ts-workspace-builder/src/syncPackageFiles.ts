import { sync } from 'glob'
import { copyFileSync } from 'fs'

import { removePrefix, flatMap } from '@spec-validator/utils/utils'

import copyRec from './copyRec'

import { read } from './readAndWrite'
import { DIST } from './generateTsConfigJson'

export default (projectPath: string): void => {
  copyFileSync(`${projectPath}/README.md`, `${projectPath}/${DIST}/README.md`)

  const packageJson: Record<string, any>  = read(`${projectPath}/package.json`)

  const files: string[] = packageJson.files || []

  flatMap(
    files.map(it => sync(`${projectPath}/${it}`)),
  ).forEach(src => {
    const relPath = removePrefix(src, `${projectPath}/`)
    const dest = `${projectPath}/${DIST}/${relPath}`
    copyRec(src, dest)
  })
}
