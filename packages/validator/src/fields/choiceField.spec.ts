import choiceField from './choiceField'
import { TypeHint } from '../core'
import $ from './segmentField'

import {
  testValidateSpecOk,
  testValidateSpecError,
  testValidateSegmentChainOK,
  testValidateSegmentChainError,
} from './TestUtils.test'
import { expectType } from '../TypeTestUtils.test'

const field = choiceField(1, 2, 3)

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

  expectType<Spec, 1 | 2 | 3>(true)

  const segmentSpec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  type SegmentSpec = TypeHint<typeof segmentSpec>

  expectType<SegmentSpec, {field: 1 | 2 | 3}>(true)
})
