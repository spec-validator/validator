import withDefault from './withDefault'
import { TypeHint } from '../core'
import { expectType } from '@spec-validator/test-utils/expectType'
import { testValidateSpecError, testValidateSpecOk } from '../TestUtils.test'
import booleanField from './booleanField'

const raw = withDefault(booleanField(), true as boolean)

test('accepts valid payload', () => {
  testValidateSpecOk(raw, true)
})

test('returns default value for undefined as input', () => {
  testValidateSpecOk(raw, undefined, true, true)
})

test ('does not let string value og through with raw field', () => {
  testValidateSpecError(raw, 'true', 'Not a boolean')
})

test('types', () => {
  type Spec = TypeHint<typeof raw>

  expectType<Spec, true>(true)
})

describe('field with FieldWithStringInputSupport as inner spec', () => {

  const field = raw.getFieldWithRegExp()

  it('allows undefined value go through', () => {
    testValidateSpecOk(field, undefined, true, 'true')
  })

  it('allows valid value go through', () => {
    testValidateSpecOk(field, true, true, 'true')
  })

  it('allows string value go through', () => {
    testValidateSpecOk(field, 'true', true, 'true')
  })

  it('does not let invalid string value go through', () => {
    testValidateSpecError(field, 'boom', 'Not a boolean')
  })

  test('types', () => {
    type Spec = TypeHint<typeof field>

    expectType<Spec, boolean>(true)
  })

})
