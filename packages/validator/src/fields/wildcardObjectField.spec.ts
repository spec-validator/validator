import { Json, TypeHint } from '..'
import { validate } from '../core'
import { expectType } from '../TypeTestUtils.test'
import wildcardObjectField from './wildcardObjectField'

const field = wildcardObjectField()

test('types', () => {
  type Spec = TypeHint<typeof field>
  expectType<Spec, Json>(true)
})

test('blocks invalid value', () => {
  expect(() => validate(field, new Date())).toThrow(
    new Error('Unexpected token T in JSON at position 0')
  )
})

test('allows valid valiue', () => {
  expect(validate(field, 42)).toEqual(42)
})
