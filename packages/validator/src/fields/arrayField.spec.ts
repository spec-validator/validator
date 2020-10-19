import { expectType } from '../TypeTestUtils.test'

import { arrayField } from '.'
import { TypeHint, serialize, getParams } from '../core'
import numberField from './numberField'

import {
  testValidateSpecError,
  testValidateSpecOk
} from './TestUtils.test'

const field = arrayField(numberField())

describe('validate', () => {

  it('allows valid choices to get throw', () => {
    testValidateSpecOk(field, [1], [1])
  })

  it('prevents invalid choices from getting through', () => {
    testValidateSpecError(field, [1, 2, false], {'inner': 'Not a number', 'path': [2]})
    testValidateSpecError(field, 11, 'Not an array')
  })

})

test('serialize', () => {
  expect(serialize(field, [1])).toEqual([1])
})

test('getParams', () => {
  expect(getParams(field)).toEqual({
    itemSpec: {}
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>;

  expectType<number[]>([] as Spec)
})
