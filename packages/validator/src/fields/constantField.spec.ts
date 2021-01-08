import { TypeHint } from '..'
import { expectType } from '../TypeTestUtils.test'
import constantField from './constantField'
import { testValidateSpecError, testValidateSpecOk } from './TestUtils.test'

const field = constantField(42)

test('field', () => {
  testValidateSpecOk(field, 42)
  testValidateSpecError(field, 43, 'Constant does not match the requirement')
})

test('types', () => {
  type Spec = TypeHint<typeof field>
  expectType<Spec, 42>(true)
})
