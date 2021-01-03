import { TypeHint } from '..'
import { expectType } from '../TypeTestUtils.test'
import constantField from './constantField'

const field = constantField(42)

test('types', () => {
  type Spec = TypeHint<typeof field>
  expectType<Spec, 42>(true)
})

test('blocks invalid value', () => {
  expect(() => field.validate(43)).toThrowError('Constant does not match the requirement')
})

test('allows valid valiue', () => {
  expect(field.validate(42)).toEqual(42)
})
