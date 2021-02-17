import { TypeHint } from '..'
import { Json } from '@spec-validator/utils/Json'
import { testValidateSpecError, testValidateSpecOk } from '../TestUtils.test'
import { expectType } from '@spec-validator/test-utils/expectType'
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
