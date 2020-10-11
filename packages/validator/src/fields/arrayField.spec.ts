import { expectType } from 'tsd'

import { arrayField } from '.'
import { TypeHint } from '../core'
import numberField from './numberField'

import {
  testValidateSpecError,
  testValidateSpecOk
} from './TestUtils.spec'

const field = arrayField(numberField())

describe('field', () => {

  it('allows valid choices to get throw', () => {
    testValidateSpecOk(field, [1], [1])
  })

  it('prevents invalid choices from getting through', () => {
    testValidateSpecError(field, [1, 2, false], {'inner': 'Not an int', 'path': [2]})
    testValidateSpecError(field, 11, 'Not an array')
  })

})

test('types', () => {
  type Spec = TypeHint<typeof field>;

  expectType<number[]>([] as Spec)
})
