
import splitIntoBuckets from './splitIntoBuckets'

test('untyped and unlabled blocks', () => {
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

test('typed and labled blocks', () => {
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
