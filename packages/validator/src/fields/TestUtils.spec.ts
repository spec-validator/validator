/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Field, validate } from '../core'
import { WithStringInputSupport } from '../WithStringInputSupport'
import { root } from '../segmentChain'

test.skip('Workaround', () => 1)

export const testValidateSpecOk = <T> (field: Field<T>, input: any, expected: T): void => {
  expect(validate(field, input)).toEqual(expected)
}

export const testValidateSpecError = <T> (field: Field<T>, input: any, expectedError: any) => {
  let error: any = null
  try {
    validate(field, input)
  } catch (err) {
    error = err
  }
  expect(error).toEqual(expectedError)
}

export const testValidateSegmentChainOK = <T> (
  field: Field<T> & WithStringInputSupport,
  input: string,
  expected: T
): void => {
  const spec = root
    ._('/')
    ._('field', field)
    ._('/suffix')

  const valid = spec.match('/' + input + '/suffix')
  expect((valid as any).field).toEqual(expected)
}

export const testValidateSegmentChainError = <T> (
  field: Field<T> & WithStringInputSupport, input: any, expectedError: any
) => {
  const spec = root
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
