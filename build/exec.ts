import exec from '../packages/cli/src/exec'
import { Task } from 'just-task'

export default (...cmd: string[]): Task =>
  async () => exec(...cmd)
