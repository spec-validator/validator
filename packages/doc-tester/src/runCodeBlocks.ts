import fs from 'fs'
import { execSync } from 'child_process'

import { Task } from 'just-task'

import discover from './discover'
import extractCodeBlocks, { Buckets, toCode } from './splitIntoBuckets'

type CodeFile = {
  file: string,
  code: Buckets
}

const runCodeFile = (codeFile: CodeFile): void => {
  try {
    Object.values(codeFile.code).forEach((blocks) => {
      execSync('yarn ts-node -r tsconfig-paths/register', {
        input: toCode(blocks),
      })
    })
  } catch (err) {
    console.error(`With errors ${codeFile.file}`)
    process.exit(1)
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
