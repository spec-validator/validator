import fs from 'fs'
import { execSync } from 'child_process'

import { Task } from 'just-task'

import discover from './discover'
import extractCodeBlocks, { Buckets } from './splitIntoBuckets'

type CodeFile = {
  file: string,
  code: Buckets
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
      fs.readFileSync(file).toString().split('\n'),
      ['ts', 'typescript']
    ),
    file,
  })).filter(it => it.code).forEach(runCodeFile)
