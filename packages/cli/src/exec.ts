import { execSync } from 'child_process'

const wrapCmdChunkInQuotes = (chunk: string) => (chunk.indexOf(' ') > 0 ? `"${chunk}"` : chunk)

const toStr = (...cmd: string[]): string => cmd.map(wrapCmdChunkInQuotes).join(' ')

export const getOutput = (...cmd: string[]): Buffer =>
  execSync(toStr(...cmd))

export default (...cmd: string[]): void => {
  execSync(toStr(...cmd), {
    stdio: 'inherit',
  })
}
