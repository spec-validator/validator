import choiceField from './choiceField'
import { TypeHint } from '../core'
import { root, SegmentTypeHint } from '../segmentChain'

import {
  testValidateSpecOk,
  testValidateSpecError,
  testValidateSegmentChainOK,
  testValidateSegmentChainError
} from './TestUtils.spec'

const field = choiceField([1, 2, 3])

const spec = {
  field
}

const segmentSpec = root
  ._('/')
  ._('field', field)
  ._('/suffix')

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SegmentSpec = SegmentTypeHint<typeof segmentSpec>
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Spec = TypeHint<typeof spec>

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
