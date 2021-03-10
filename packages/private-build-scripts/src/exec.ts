import { Task } from 'just-task'

import exec from '@spec-validator/cli/exec'

export default (...cmd: string[]): Task =>
  async () => exec(...cmd)
