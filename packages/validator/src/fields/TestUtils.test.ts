/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Field, getParams, serialize, validate } from '../core'
import { WithStringInputSupport } from '../WithStringInputSupport'
import { $ } from '../segmentChain'
import { Any } from '../util-types'

export const testValidateSpecOk = <T extends Any> (field: Field<T>, input: any, expected: T): void => {
  expect(validate(field, input)).toEqual(expected)
}

export const testSerializeSpecOk = <T extends Any> (field: Field<T>, input: T, expected: any): void => {
  expect(serialize(field, input)).toEqual(expected)
}

export const testGetParams = <T extends Any> (field: Field<T>, expected: any): void => {
  expect(getParams(field)).toEqual(expected)
}

export const testValidateSpecError = <T extends Any> (field: Field<T>, input: any, expectedError: any) => {
  let error: any = null
  try {
    validate(field, input)
  } catch (err) {
    error = err
  }
  expect(error).toEqual(expectedError)
}

export const testValidateSegmentChainOK = <T extends Any> (
  field: Field<T> & WithStringInputSupport,
  input: string,
  expected: T
): void => {
  const spec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  const valid = spec.match('/' + input + '/suffix')
  expect((valid as any).field).toEqual(expected)
}

export const testValidateSegmentChainError = <T extends Any> (
  field: Field<T> & WithStringInputSupport, input: any, expectedError: any
) => {
  const spec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  let error: any = null
  try {
    spec.match('/' + input + '/suffix')
  } catch (err) {
    error = err
  }
  if (expectedError === 'Didn\'t match') {
    expect(error).toEqual(expectedError)
  } else {
    expect(error).toEqual({'inner': expectedError, 'path': ['field']})
  }
}
