import { headerObjectField } from '.'
import { expectType } from '@spec-validator/test-utils/expectType'
import { numberField } from '@spec-validator/validator/fields'
import { testValidateSpecError, testValidateSpecOk } from '@spec-validator/validator/TestUtils.test'
import { TypeHint } from '@spec-validator/validator'

const field = headerObjectField({
  num: numberField(),
  num2: numberField(),
})

describe('field', () => {

  it('allows valid choices to get throw', () => {
    testValidateSpecOk(field, 'num=42; num2=43', {'num': 42, 'num2': 43})
  })

  it('prevents payload with missing value to go through', () => {
    testValidateSpecError(field, 'foo', {'inner': 'Not an int', 'path': ['num']})
  })

  it('prevents non string to go through', () => {
    testValidateSpecError(field, null, 'Not a string')
  })

  it('prevents wrong value to go through', () => {
    testValidateSpecError(field, 'num=foo; num2=43', {'inner': 'Not an int', 'path': ['num']})
  })

})

test('types', () => {

  type Spec = TypeHint<typeof field>

  expectType<Spec, {
    num: number,
    num2: number
  }>(true)

})
