import { Field, validate } from '../core';
import { root, WithRegExp } from '../segmentChain';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const testValidateSpecOk = <T> (field: Field<T>, input: any, expected: T): void => {
  expect(validate({
    field
  }, {
    field: input
  })).toEqual({
    field: expected
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

export const testValidateSegmentChainOK = <T> (field: Field<T> & WithRegExp, input: string, expected: T): void => {
  const spec = root
    ._('/')
    ._('field', field);

  const valid = spec.match('/' + input + '/bla');
  expect((valid as any).field).toEqual({
    field: expected
  })
}
