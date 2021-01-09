import { execSync } from 'child_process'

const wrapCmdChunkInQuotes = (chunk: string) => (chunk.indexOf(' ') > 0 ? `"${chunk}"` : chunk)

const exec = (...cmd: string[]): Buffer =>
  execSync(cmd.map(wrapCmdChunkInQuotes).join(' '), {
    stdio: 'inherit',
  })

export default exec
