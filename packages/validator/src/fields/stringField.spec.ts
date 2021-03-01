import { expectType } from '@spec-validator/test-utils/expectType'
import { TypeHint } from '../core'
import $ from './segmentField'
import stringField from './stringField'

import {
  testValidateSegmentChainError,
  testValidateSegmentChainOK,
} from './TestUtils.test'
import { testValidateSpecOk, testValidateSpecError } from '../TestUtils.test'

const field = stringField(/[A-Z]+/)

test('field', () => {
  testValidateSpecOk(field, 'AA', 'AA')
  testValidateSpecError(field, false, 'Not a string')
  testValidateSpecError(field, '12', 'Doesn\'t match a regex')
})

test('segmentChain', () => {
  testValidateSegmentChainOK(field, 'AA', 'AA')
  testValidateSegmentChainError(field, '12')
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, string>(true)

  const segmentSpec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  type SegmentSpec = TypeHint<typeof segmentSpec>

  expectType<SegmentSpec, {field: string}>(true)
})

