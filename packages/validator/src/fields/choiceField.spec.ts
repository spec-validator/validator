import choiceField from './choiceField'
import { TypeHint } from '../core'
import $ from './segmentField'

import {
  testValidateSegmentChainOK,
  testValidateSegmentChainError,
} from './TestUtils.test'
import { expectType } from '@spec-validator/test-utils/expecType'
import { testValidateSpecOk, testValidateSpecError } from '../TestUtils.test'

const field = choiceField(1, 2, 3)

test('field', () => {
  testValidateSpecOk(field, 1)
  testValidateSpecError(field, 4, 'Invalid choice')
})

test('segmentChain', () => {
  testValidateSegmentChainOK(field, '1', 1)
  testValidateSegmentChainError(field, '12', 'Didn\'t match')
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, 1 | 2 | 3>(true)

  const segmentSpec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  type SegmentSpec = TypeHint<typeof segmentSpec>

  expectType<SegmentSpec, {field: 1 | 2 | 3}>(true)
})
