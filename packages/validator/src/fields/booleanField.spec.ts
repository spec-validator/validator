import { expectType } from '../TypeTestUtils.test'
import { TypeHint } from '../core'
import { $, SegmentTypeHint } from '../segmentChain'
import booleanField from './booleanField'
import {
  testValidateSegmentChainError,
  testValidateSegmentChainOK,
  testValidateSpecError,
  testValidateSpecOk,
} from './TestUtils.test'

const field = booleanField()

describe('field', () => {

  it('allows valid choices to get throw', () => {
    testValidateSpecOk(field, true, true)
    testValidateSpecOk(field, false, false)
  })

  it('prevents invalid choices from getting through', () => {
    testValidateSpecError(field, 'foo', 'Not a boolean')
  })

})

describe('segmentChain', () => {

  it('allows valid choices to get throw', () => {
    ['1', 'true'].forEach(it => testValidateSegmentChainOK(field, it, true));
    ['0', 'false'].forEach(it => testValidateSegmentChainOK(field, it, false))
  })

  it('prevents invalid choices from getting through', () => {
    testValidateSegmentChainError(field, 'foo', 'Didn\'t match')
  })

})

test('types', () => {
  type Spec = TypeHint<typeof field>;

  expectType<boolean>(true as Spec)

  const segmentSpec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  type SegmentSpec = SegmentTypeHint<typeof segmentSpec>

  expectType<{field: boolean}>({ field: true } as SegmentSpec)
})
