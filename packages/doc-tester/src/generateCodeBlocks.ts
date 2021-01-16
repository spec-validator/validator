import path from 'path'
import fs from 'fs'

import discover from './discover'
import extractCodeBlocks from './codeBlocks'

const trimPrefix = (str: string, prefix: string) => {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length)
  } else {
    return str
  }
}

const ensureDirExists = (filePath: string): string => {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  return filePath
}

export default (root: string): void => {
  discover(root, /^.*\.md$/, /node_modules/).map(readme => {
    const blocks = extractCodeBlocks(
      fs.readFileSync(readme).toString(),
      ['ts', 'typescript']
    )
    if (blocks) {
      fs.writeFileSync(
        ensureDirExists(
          `${root}/doc-tests/${trimPrefix(readme, root)}.ts`
        ),
        blocks
      )
    }
  })
}
