import { execSync } from 'child_process'

import { mocked } from 'ts-jest/utils'

jest.mock('child_process', () => ({
  execSync: jest.fn(),
}))

const execSyncMocked = mocked(execSync)

import exec from './exec'

test('exec', () => {

  exec('ls', '-l')

  expect(execSyncMocked).toHaveBeenCalledWith('ls -l', {
    stdio: 'inherit',
  })

})
