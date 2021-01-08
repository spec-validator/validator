import withDefault from './withDefault'
import { TypeHint } from '../core'
import { expectType } from '../TypeTestUtils.test'
import numberField from './numberField'
import { validate } from '..'
import { testValidateSpecOk } from '../TestUtils.test'

const field = withDefault(numberField(), 42)

test('field', () => {
  expect(validate(field, undefined)).toEqual(42)
  testValidateSpecOk(field, 57)
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, number>(true)
})
