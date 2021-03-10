import main from './runCodeBlocks'

jest.mock('fs', () => ({
  readFileSync: () => [
    '# Title',
    '```ts',
    'const meaning = 42',
    '```',
  ].join('\n'),
  __esModule: true,
}))

jest.mock('./discover', () => ({
  default: () => ['ONE.md', 'TWO.md'],
  __esModule: true,
}))

const execSync = jest.fn()

jest.mock('child_process', () => ({
  execSync: (cmd: string, props: unknown) => execSync(cmd, props),
  __esModule: true,
}))

const infoOrig = console.info
const errorOrig = console.error
const exitOrig = process.exit

beforeEach(() => {
  console.info = jest.fn()
  console.error = jest.fn()
  process.exit = jest.fn() as any
})

afterEach(() => {
  console.info = infoOrig
  console.error = errorOrig
  process.exit = exitOrig
})

test('ok', () => {
  main()
  expect(execSync.mock.calls).toMatchSnapshot()
})

test('nok', () => {
  execSync.mockImplementation(() => { throw 'Boom!' })
  main()
  expect(console.error).toBeCalledWith('With errors ONE.md')
  expect(process.exit).toBeCalledWith(1)
})
