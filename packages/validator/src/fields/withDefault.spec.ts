import withDefault from './withDefault'
import { TypeHint } from '../core'
import { expectType } from '../../../test-utils/src/expecType'
import { validate } from '..'
import { sampleField, testValidateSpecOk } from '../TestUtils.test'

const field = withDefault(sampleField, true)

test('field', () => {
  expect(validate(field, undefined)).toEqual(true)
  testValidateSpecOk(field, true)
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, true>(true)
})
