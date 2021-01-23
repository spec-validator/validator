/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $, { FieldWithRegExpSupport } from './segmentField'
import { Any } from '@spec-validator/utils/util-types'
import { serialize, validate } from '../interface'

export const testValidateSegmentChainOK = <T extends Any> (
  field: FieldWithRegExpSupport<T>,
  input: string,
  expected: T,
  expectedSerialized?: string
): void => {
  const spec = $
    ._('/')
    ._('field', field)
    ._('/suffix') as any

  const value = '/' + input + '/suffix'

  const valid = validate(spec, value)
  expect(valid).toEqual({
    field: expected,
  })
  expect(serialize(spec, { field: expected } as any)).toEqual('/' + (expectedSerialized || input) + '/suffix')
}

export const testValidateSegmentChainError = <T extends Any> (
  field: FieldWithRegExpSupport<T>, input: any, expectedError: any
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
