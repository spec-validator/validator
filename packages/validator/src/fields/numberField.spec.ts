import { expectType } from '../TypeTestUtils.test'
import { TypeHint } from '../core'
import { $, SegmentTypeHint } from '../segmentChain'
import numberField from './numberField'

import {
  testValidateSegmentChainError,
  testValidateSegmentChainOK,
  testValidateSpecError,
  testValidateSpecOk
} from './TestUtils.test'

describe('spec', () => {

  it('intField signed', () => {
    const field = numberField()
    testValidateSpecOk(field, 12, 12)
    testValidateSpecOk(field, 0, 0)
    testValidateSpecOk(field, -1, -1)

    testValidateSpecError(field, -1.2, 'Not an int')
    testValidateSpecError(field, 1.2, 'Not an int')
    testValidateSpecError(field, '1', 'Not a number')
  })

  it('floatField signed', () => {
    const field = numberField({
      canBeFloat: true
    })
    testValidateSpecOk(field, 12, 12)
    testValidateSpecOk(field, 0, 0)
    testValidateSpecOk(field, -1, -1)
    testValidateSpecOk(field, -1.2, -1.2)
    testValidateSpecOk(field, 1.2, 1.2)
    testValidateSpecError(field, '1', 'Not a number')
  })

})

describe('segmentChain', () => {

  it('intField', () => {
    const field = numberField()
    testValidateSegmentChainOK(field, '12', 12)
    testValidateSegmentChainOK(field, '0', 0)
    testValidateSegmentChainOK(field, '-1', -1)

    testValidateSegmentChainError(field, '-1.2', 'Didn\'t match')
    testValidateSegmentChainError(field, '1.2', 'Didn\'t match')
    testValidateSegmentChainError(field, 'A', 'Didn\'t match')
  })

  it('floatField', () => {
    const field = numberField({
      canBeFloat: true
    })
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

  type Spec = TypeHint<typeof field>;

  expectType<number>(1 as Spec)

  const segmentSpec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  type SegmentSpec = SegmentTypeHint<typeof segmentSpec>

  expectType<{field: number}>({ field: 1 } as SegmentSpec)
})
