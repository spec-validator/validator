import { expectType } from '../TypeTestUtils.test'

import arrayField from './arrayField'
import { TypeHint } from '../core'
import numberField from './numberField'
import { testValidateSpecOk, testValidateSpecError } from '../TestUtils.test'

const field = arrayField(numberField())

describe('field', () => {

  it('valid', () => {
    testValidateSpecOk(field, [1])
  })

  it('not an array', () => {
    testValidateSpecError(field, 11, 'Not an array')
  })

  it('invalid item', () => {
    testValidateSpecError(field, [1, 2, false], {'inner': 'Not a number', 'path': [2]})
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>;

  expectType<Spec, number[]>(true)
})
