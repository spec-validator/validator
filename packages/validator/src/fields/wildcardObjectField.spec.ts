import { Json, TypeHint } from '..'
import { expectType } from '../TypeTestUtils.test'
import { testValidateSpecOk, testValidateSpecError } from './TestUtils.test'
import wildcardObjectField from './wildcardObjectField'

const field = wildcardObjectField()

test('field', () => {
  testValidateSpecError(field, new Date(), /Unexpected token \w{1} in JSON at position 0/)
  testValidateSpecOk(field, 42)
})

test('types', () => {
  type Spec = TypeHint<typeof field>
  expectType<Spec, Json>(true)
})
