/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { SpecUnion } from './core'
import { serialize, validate } from './interface'

export const sampleField = {
  validate: (it: any): true => {
    if (it === true) {
      return true
    }
    throw 'Boom!'
  },
  serialize: (it: true) => it,
}

export const testValidateSpecOk = <T> (
  field: SpecUnion, input: any, expected?: T, expectedSerialized?: any
): void => {
  // Test deserialization + validation
  expect(validate(field, input)).toEqual(expected || input)
  // And serialization as well
  expect(serialize(field, (expected || input) as any)).toEqual(expectedSerialized || input)
}

export const testValidateSpecError = (field: SpecUnion, input: any, expectedError: any) => {
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
