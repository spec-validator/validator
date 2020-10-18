import { expectType } from '../TypeTestUtils.test'
import { TypeHint } from '../core'
import { $, SegmentTypeHint } from '../segmentChain'
import stringField from './stringField'

import {
  testValidateSegmentChainError,
  testValidateSegmentChainOK,
  testValidateSpecError,
  testValidateSpecOk
} from './TestUtils.test'

const field = stringField(/[A-Z]+/)

describe('spec', () => {

  it('allows valid choices to get throw', () => {
    testValidateSpecOk(field, 'AA', 'AA')
  })

  it('prevents invalid choices from getting through', () => {
    testValidateSpecError(field, false, 'Not a string')
    testValidateSpecError(field, '12', 'Doesn\'t match a regex')
  })

})

describe('segmentChain', () => {

  it('allows valid choices to get throw', () => {
    testValidateSegmentChainOK(field, 'AA', 'AA')
  })

  it('prevents invalid choices from getting through', () => {
    testValidateSegmentChainError(field, '12', 'Didn\'t match')
  })

})

test('types', () => {
  type Spec = TypeHint<typeof field>;

  expectType<string>('' as Spec)

  const segmentSpec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  type SegmentSpec = SegmentTypeHint<typeof segmentSpec>

  expectType<{field: string}>({ field: '' } as SegmentSpec)
})

