import { readFileSync } from 'fs'
import { execSync } from 'child_process'

import discover from './discover'
import extractCodeBlocks, { Buckets, toCode } from './splitIntoBuckets'

type CodeFile = {
  file: string,
  code: Buckets
}

const runCodeFile = (codeFile: CodeFile): void => {
  console.info(`Checking ${codeFile.file}`)
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

const main = (): void =>
  discover(process.cwd(), /^.*\.md$/, /node_modules/).map(file => ({
    code: extractCodeBlocks(
      readFileSync(file).toString().split('\n'),
      ['ts', 'typescript']
    ),
    file,
  })).filter(it => it.code).forEach(runCodeFile)

export default main

/* istanbul ignore if */
if (require.main === module) {
  main()
}
