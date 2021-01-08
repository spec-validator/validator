/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Field, SpecUnion } from '../core'
import $, { FieldWithStringInputSupport } from './segmentField'
import { Any } from '../util-types'
import { validate } from '../interface'

export const testValidateSpecOk = <T extends Any> (field: SpecUnion<T>, input: any, expected?: T): void => {
  // Test deserialization + validation
  expect(validate(field, input)).toEqual(expected || input)
  // And serialization as well
  expect(serialize(field, (expected || input) as any)).toEqual(input)

}

export const testValidateSpecError = <T extends Any> (field: Field<T>, input: any, expectedError: any) => {
  let error: any = null
  try {
    validate(field, input)
  } catch (err) {
    if (err instanceof Error) {
      error = err.message
    } else {
      error = err
    }
  }
  if (expectedError instanceof RegExp) {
    expect((error as string).match(expectedError)).toBeTruthy()
  } else {
    expect(error).toEqual(expectedError)
  }
}

export const testValidateSegmentChainOK = <T extends Any> (
  field: FieldWithStringInputSupport<T>,
  input: string,
  expected: T,
  expectedSerialized?: string
): void => {
  const spec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  const value = '/' + input + '/suffix'

  const valid = validate(spec, value)
  expect(valid).toEqual({
    field: expected,
  })
  expect(serialize(spec, { field: expected } as any)).toEqual('/' + (expectedSerialized || input) + '/suffix')
}

export const testValidateSegmentChainError = <T extends Any> (
  field: FieldWithStringInputSupport<T>, input: any, expectedError: any
) => {
  const spec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  let error: any = null
  try {
    spec.validate('/' + input + '/suffix')
  } catch (err) {
    error = err
  }
  if (expectedError === 'Didn\'t match') {
    expect(error).toEqual(expectedError)
  } else {
    expect(error).toEqual({'inner': expectedError, 'path': ['field']})
  }
}
