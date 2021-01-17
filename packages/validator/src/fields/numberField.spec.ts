import { expectType } from '@spec-validator/test-utils/expectType'
import { TypeHint } from '../core'
import $ from './segmentField'
import numberField from './numberField'

import {
  testValidateSegmentChainError,
  testValidateSegmentChainOK,
} from './TestUtils.test'
import { testValidateSpecOk, testValidateSpecError } from '../TestUtils.test'

describe('spec', () => {

  it('intField signed', () => {
    const field = numberField({ signed: true })
    testValidateSpecOk(field, 12, 12)
    testValidateSpecOk(field, 0, 0)
    testValidateSpecOk(field, -1, -1)

    testValidateSpecError(field, -1.2, 'Not an int')
    testValidateSpecError(field, 1.2, 'Not an int')
    testValidateSpecError(field, '1', 'Not a number')
  })

  it('intField unsigned', () => {
    const field = numberField({ signed: false })
    testValidateSpecError(field, -1, 'Must be unsigned')
  })

  it('floatField signed', () => {
    const field = numberField({ canBeFloat: true, signed: true })
    testValidateSpecOk(field, 12, 12)
    testValidateSpecOk(field, 0, 0)
    testValidateSpecOk(field, -1, -1)
    testValidateSpecOk(field, -1.2, -1.2)
    testValidateSpecOk(field, 1.2, 1.2)
    testValidateSpecError(field, '1', 'Not a number')
  })

  it('floatField unsigned', () => {
    const field = numberField({ canBeFloat: true, signed: false })
    testValidateSpecError(field, -1.2, 'Must be unsigned')
  })

})

describe('segmentChain', () => {

  it('intField', () => {
    const field = numberField({ signed: true })
    testValidateSegmentChainOK(field, '12', 12)
    testValidateSegmentChainOK(field, '0', 0)
    testValidateSegmentChainOK(field, '-1', -1)

    testValidateSegmentChainError(field, '-1.2', 'Didn\'t match')
    testValidateSegmentChainError(field, '1.2', 'Didn\'t match')
    testValidateSegmentChainError(field, 'A', 'Didn\'t match')
  })

  it('floatField', () => {
    const field = numberField({ canBeFloat: true, signed: true })
    testValidateSegmentChainOK(field, '12', 12)
    testValidateSegmentChainOK(field, '0', 0)
    testValidateSegmentChainOK(field, '-1', -1)
    testValidateSegmentChainOK(field, '-1.2', -1.2)
    testValidateSegmentChainOK(field, '1.2', 1.2)
    testValidateSegmentChainError(field, 'A', 'Didn\'t match')
  })

})

test('types', () => {
  const field = numberField()

  type Spec = TypeHint<typeof field>

  expectType<Spec, number>(true)

  const segmentSpec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  type SegmentSpec = TypeHint<typeof segmentSpec>

  expectType<SegmentSpec, {field: number}>(true)
})
