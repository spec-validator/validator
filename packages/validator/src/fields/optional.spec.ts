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

    expectType<Spec, boolean>(true)
    expectType<Spec, undefined>(true)
})


describe('field with FieldWithStringInputSupport as inner spec', () => {

  const field = raw.getStringField()

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

    expectType<Spec, boolean>(true)
    expectType<Spec, undefined>(true)
  })

})

describe('field without string support as inner spec', () => {

  const field = optional({
    key: booleanField(),
  })

  it('works with a valid payload', () => {
    testValidateSpecOk(field, { key: true})
  })

  it('breaks with invalid payload', () => {
    testValidateSpecError(field, 11, 'Not an object')
  })

  it('works with undefined payload', () => {
    testValidateSpecOk(field, undefined)
  })

})
