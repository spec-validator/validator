import fs from 'fs'

import discover from './discover'
import extractCodeBlocks from './codeBlocks'

type CodeFile = {
  file: string,
  code: string
}

const runCodeFile = (codeFile: CodeFile): void => {
  codeFile.code
}

export default (root: string): void =>
  discover(root, /^.*\.md$/, /node_modules/).map(file => ({
    code: extractCodeBlocks(
      fs.readFileSync(file).toString(),
      ['ts', 'typescript']
    ),
    file,
  })).filter(it => it.code).forEach(runCodeFile)

