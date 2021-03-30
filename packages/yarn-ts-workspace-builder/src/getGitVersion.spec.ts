import getGitVersion from './getGitVersion'

const getOutput = jest.fn()

jest.mock('@spec-validator/cli', () => ({
  getOutput: () => getOutput(),
  __esModule: true,
}))

beforeEach(() => {
  delete process.env.PR
  delete process.env.CI
})

test('PR', () => {
  process.env.PR = 'true'
  expect(getGitVersion()).toMatch('0.0.1')
})

test('locally', () => {
  getOutput.mockReturnValue('1.1.1\nfoobar')
  expect(getGitVersion()).toMatch('1.1.1')
})

describe('in CI', () => {

  beforeEach(() => {
    delete process.env.PR
    process.env.CI = 'true'
  })

  it('with proper value', () => {
    getOutput.mockReturnValue('foo\n1.1.1\nbar')
    expect(getGitVersion()).toMatch('1.1.1')
  })

  it('without value', () => {
    getOutput.mockReturnValue('foobar')
    expect(getGitVersion).toThrow('Commit doesn\'t point at any semver tag')
  })
})
