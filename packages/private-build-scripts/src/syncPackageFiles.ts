import glob from 'glob'
import fs from 'fs'
import util from 'util'

import { Task } from 'just-task'

import { removePrefix, flatMap } from '@spec-validator/utils/utils'

import copyRec from './copyRec'

import { read } from './readAndWrite'
import { DIST } from './generateTsConfigJson'

const copyFile = util.promisify(fs.copyFile)

export default (projectPath: string): Task => async () => {
  copyFile(`${projectPath}/README.md`, `${projectPath}/${DIST}/README.md`)

  const packageJson: Record<string, any>  = read(`${projectPath}/package.json`)

  const files: string[] = packageJson.files || []

  flatMap(
    files.map(it => glob.sync(`${projectPath}/${it}`)),
  ).forEach(src => {
    const relPath = removePrefix(src, `${projectPath}/`)
    const dest = `${projectPath}/${DIST}/${relPath}`
    copyRec(src, dest)
  })
}
