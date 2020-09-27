/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Field, validate } from '../core';
import { root, WithRegExpSupport } from '../segmentChain';

test.skip('Workaround', () => 1)

export const testValidateSpecOk = <T> (field: Field<T>, input: any, expected: T): void => {
  expect(validate({
    field
  }, {
    field: input
  })).toEqual({
    field: expected
  });
}

export const testValidateSpecError = <T> (field: Field<T>, input: any, expectedError: any) => {
  let error: any = null;
  try {
    validate({
      field
    }, {
      field: input
    });
  } catch (err) {
    error = err;
  }
  expect(error).toEqual({'inner': expectedError, 'path': ['field']})
}

export const testValidateSegmentChainOK = <T> (
  field: Field<T> & WithRegExpSupport,
  input: string,
  expected: T
): void => {
  const spec = root
    ._('/')
    ._('field', field)
    ._('/suffix');

  const valid = spec.match('/' + input + '/suffix');
  expect((valid as any).field).toEqual(expected)
}

export const testValidateSegmentChainError = <T> (
  field: Field<T> & WithRegExpSupport, input: any, expectedError: any
) => {
  const spec = root
    ._('/')
    ._('field', field)
    ._('/suffix');

  let error: any = null;
  try {
    spec.match('/' + input + '/suffix')
  } catch (err) {
    error = err;
  }
  expect(error).toEqual(expectedError)
}
