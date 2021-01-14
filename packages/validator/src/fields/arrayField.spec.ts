import { expectType } from '@spec-validator/test-utils/expecType'

import arrayField from './arrayField'
import { TypeHint } from '../core'
import { testValidateSpecOk, testValidateSpecError, sampleField } from '../TestUtils.test'

const field = arrayField(sampleField)

describe('field', () => {

  it('valid', () => {
    testValidateSpecOk(field, [true])
  })

  it('not an array', () => {
    testValidateSpecError(field, true, 'Not an array')
  })

  it('invalid item', () => {
    testValidateSpecError(field, [true, true, false], {'inner': 'Boom!', 'path': [2]})
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, true[]>(true)
})
