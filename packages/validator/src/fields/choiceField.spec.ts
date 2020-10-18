import choiceField from './choiceField'
import { TypeHint } from '../core'
import { $, SegmentTypeHint } from '../segmentChain'

import {
  testValidateSpecOk,
  testValidateSpecError,
  testValidateSegmentChainOK,
  testValidateSegmentChainError,
  testGetParams
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

  it('returns proper params', () => {
    testGetParams(field, {
      'choices':  [
        1,
        2,
        3,
      ],
      'description': undefined,
    })
  })

  it('serializes data properly', () => {
    // pass
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

  const segmentSpec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  type SegmentSpec = SegmentTypeHint<typeof segmentSpec>

  expectType<{field: 1 | 2 | 3}>({ field: 1 } as SegmentSpec)
})
