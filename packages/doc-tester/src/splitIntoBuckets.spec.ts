
import splitIntoBuckets from './splitIntoBuckets'

describe('extractType', () => {
  it('untyped and unlabeled', () => {
    // TODO
  })

  it('typed and labeled', () => {
    // TODO
  })

  it('typed and unlabeled', () => {
    // TODO
  })

  it('typed and unlabeled', () => {
    // TODO
  })
})

test('untyped and unlabeled blocks', () => {
  expect(splitIntoBuckets(
    [
      '# Title',
      '```',
      'CODE',
      '```',
      'Text',
      '```',
      'CODE 2',
      '```',
    ],
    ['']
  )).toMatchSnapshot()
})

test('typed and labeled blocks', () => {
  expect(splitIntoBuckets(
    [
      '# Title',
      '```ts one',
      'CODE',
      '```',
      'Text',
      '```ts one',
      'CODE 2',
      '```',
    ],
    ['ts']
  )).toMatchSnapshot()
})
