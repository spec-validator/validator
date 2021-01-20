import optional from './optional'
import { TypeHint } from '../core'
import { expectType } from '@spec-validator/test-utils/expectType'
import { testValidateSpecError, testValidateSpecOk } from '../TestUtils.test'
import booleanField from './booleanField'

const raw = optional(booleanField())

test('allows undefined value go through', () => {
  testValidateSpecOk(raw, undefined)
})

it('allows valid value go through', () => {
  testValidateSpecOk(raw, true)
})

test('allows undefined nested value go through', () => {
  testValidateSpecOk({
    inner: raw,
  }, {
    inner: undefined,
  })
})

test('allows defined nested value go through', () => {
  testValidateSpecOk({
    inner: raw,
  }, {
    inner: true,
  })
})


test ('does not let string value og through with raw field', () => {
  testValidateSpecError(raw, 'true', 'Not a boolean')
})

test('types', () => {
    type Spec = TypeHint<typeof raw>

    expectType<Spec, boolean | undefined>(true)
})


describe('field with FieldWithStringInputSupport as inner spec', () => {

  const field = raw.getFieldWithRegExp()

  it('allows undefined value go through', () => {
    testValidateSpecOk(field, undefined)
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

    expectType<Spec, boolean | undefined>(true)
  })

})

