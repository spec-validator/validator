import glob from 'glob'
import fs from 'fs'
import util from 'util'

import { Task } from 'just-task'

import { removePrefix, flatMap } from '@spec-validator/utils/utils'

import copyRec from './copyRec'

import { read } from './readAndWrite'

const copyFile = util.promisify(fs.copyFile)

export default (projectPath: string): Task => async () => {
  const packageJson: Record<string, any>  = read(`${projectPath}/package.json`)

  const files: string[] = packageJson.files || []

  copyFile(`${projectPath}/README.md`, `${projectPath}/dist/README.md`)

  flatMap(
    files.map(it => glob.sync(`${projectPath}/${it}`)),
  ).forEach(src => {
    const relPath = removePrefix(src, `${projectPath}/`)
    const dest = `${projectPath}/dist/${relPath}`
    copyRec(src, dest)
  })
}
