import { arrayField } from '.'
import { TypeHint, validate } from '../core'
import numberField from './numberField'
import { expectType } from 'tsd'

test('allows valid array to get through', () => {
  const spec = arrayField(numberField())

  const valid = validate(spec, [1])
  expect(valid).toEqual([1])
})

test('reports an error with full path leading to it if there are issues', () => {
  const spec = arrayField(numberField())
  try {
    validate(spec, [1, 2, false])
  } catch (err) {
    expect(err).toEqual({'inner': 'Not an int', 'path': [2]})
  }
})

test('reports an error if value is not an array', () => {
  const spec = arrayField(numberField())

  try {
    validate(spec, 11)
  } catch (err) {
    expect(err).toEqual('Not an array')
  }
})

test('types', () => {
  const spec = {
    field: arrayField(numberField())
  }

  type Spec = TypeHint<typeof spec>;

  expectType<{
    field: number[]
  }>({} as Spec)
})
