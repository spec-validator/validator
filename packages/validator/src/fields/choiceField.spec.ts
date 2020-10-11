import choiceField from './choiceField'
import { TypeHint } from '../core'
import { root, SegmentTypeHint } from '../segmentChain'

import {
  testValidateSpecOk,
  testValidateSpecError,
  testValidateSegmentChainOK,
  testValidateSegmentChainError
} from './TestUtils.spec'
import { expectType } from 'tsd'

const field = choiceField([1, 2, 3])

const segmentSpec = root
  ._('/')
  ._('field', field)
  ._('/suffix')

describe('spec', () => {

  it('allows valid choices to get throw', () => {
    testValidateSpecOk(field, 1, 1)
  })

  it('prevents invalid choices from getting through', () => {
    testValidateSpecError(field, 4, 'Invalid choice')
  })

})

describe('segmentChain', () => {
  it('allows valid choices to get throw', () => {
    testValidateSegmentChainOK(field, '1', 1)
  })

  it('prevents invalid choices from getting through', () => {
    testValidateSegmentChainError(field, '12', 'Didn\'t match')
  })

})

test('types', () => {
  type Spec = TypeHint<typeof field>;

  expectType<1 | 2 | 3>(1 as Spec)

  type SegmentSpec = SegmentTypeHint<typeof segmentSpec>

  expectType<{field: 1 | 2 | 3}>({ field: 1 } as SegmentSpec)
})
