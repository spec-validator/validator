
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
