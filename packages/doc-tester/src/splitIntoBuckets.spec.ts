
import splitIntoBuckets, { extractType } from './splitIntoBuckets'

describe('extractType', () => {
  it('untyped and unlabeled', () => {
    expect(extractType('```')).toEqual({
      type: '',
      label: '',
    })
  })

  it('typed and labeled', () => {
    expect(extractType('```ts one')).toEqual({
      type: 'ts',
      label: 'one',
    })
  })

  it('typed and unlabeled', () => {
    expect(extractType('```ts')).toEqual({
      type: 'ts',
      label: '',
    })
  })

  it('typed and unlabeled', () => {
    expect(extractType('``` one')).toEqual({
      type: '',
      label: 'one',
    })
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


test('typed and unlabeled blocks', () => {
  expect(splitIntoBuckets(
    [
      '# Title',
      '```ts',
      'CODE',
      '```',
      'Text',
      '```ts',
      'CODE 2',
      '```',
    ],
    ['ts']
  )).toMatchSnapshot()
})

test('untyped and labeled blocks', () => {
  expect(splitIntoBuckets(
    [
      '# Title',
      '``` one',
      'CODE',
      '```',
      'Text',
      '``` one',
      'CODE 2',
      '```',
    ],
    ['']
  )).toMatchSnapshot()
})

test('mixed blocks', () => {
  expect(splitIntoBuckets(
    [
      '#Title 1',
      '```ts one',
      'Labeled ts code',
      '```',
      '#Title 2',
      '```ts',
      'Unlabeled ts code',
      '```',
      '#Title 3',
      '``` one',
      'Labeled wildcard code',
      '```',
      '#Title 3',
      '```',
      'Unlabeled wildcard code',
      '```',
    ],
    ['ts', '']
  )).toMatchSnapshot()
})
