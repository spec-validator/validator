import unionField from './unionField'
import { serialize, TypeHint, validate } from '../core'
import { expectType } from '../TypeTestUtils.test'
import { objectField, booleanField , choiceField, stringField } from '.'

const field = unionField(
  stringField(),
  choiceField(1, 2, 3),
  booleanField(),
  objectField({
    innerField: stringField(),
  })
)

test('validation', () => {
  expect(validate(field, 1)).toEqual(1)
  expect(validate(field, 3)).toEqual(3)
  expect(validate(field, true)).toEqual(true)
  expect(validate(field, 'foo')).toEqual('foo')
  expect(validate(field, {
    innerField: 'foo',
  })).toEqual({
    innerField: 'foo',
  })
})

test('serialization', () => {
  expect(serialize(field, 1)).toEqual(1)
  expect(serialize(field, 3)).toEqual(3)
  expect(serialize(field, true)).toEqual(true)
  expect(serialize(field, 'foo')).toEqual('foo')
  expect(serialize(field, {
    innerField: 'foo',
  })).toEqual({
    innerField: 'foo',
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, string | boolean | 1 | 2 | 3 | { innerField: string }>(true)
})
