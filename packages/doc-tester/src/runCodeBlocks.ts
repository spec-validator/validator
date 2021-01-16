import fs from 'fs'
import { execSync } from 'child_process'

import { Task } from 'just-task'

import discover from './discover'
import extractCodeBlocks from './codeBlocks'

type CodeFile = {
  file: string,
  code: string
}

const runCodeFile = (codeFile: CodeFile): void => {
  try {
    execSync('yarn ts-node', {
      input: codeFile.code,
    })
  } catch (err) {
    console.error(`With errors ${codeFile.file}`)
    console.error(err.stderr.toString())
  }
}

export default (root: string): Task => async () =>
  discover(root, /^.*\.md$/, /node_modules/).map(file => ({
    code: extractCodeBlocks(
      fs.readFileSync(file).toString(),
      ['ts', 'typescript']
    ),
    file,
  })).filter(it => it.code).forEach(runCodeFile)
