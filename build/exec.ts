import { Task } from 'just-task'

import { execSync } from 'child_process'

const wrapCmdChunkInQuotes = (chunk: string) => (chunk.indexOf(' ') > 0 ? `"${chunk}"` : chunk)

export default (...cmd: string[]): Task =>
  async () => {
    execSync(cmd.map(wrapCmdChunkInQuotes).join(' '), {
      stdio: 'inherit',
    })
  }
