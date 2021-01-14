import { expectType } from '../../../test-utils/src/expecType'
import { TypeHint } from '../core'
import $ from './segmentField'
import booleanField from './booleanField'
import {
  testValidateSegmentChainError,
  testValidateSegmentChainOK,
} from './TestUtils.test'
import { testValidateSpecOk, testValidateSpecError } from '../TestUtils.test'

const field = booleanField()

test('field', () => {
  testValidateSpecOk(field, true)
  testValidateSpecOk(field, false)
  testValidateSpecError(field, 'foo', 'Not a boolean')
})

test('segmentChain', () => {
  ['1', 'true'].forEach(it => testValidateSegmentChainOK(field, it, true, 'true'));
  ['0', 'false'].forEach(it => testValidateSegmentChainOK(field, it, false, 'false'))
  testValidateSegmentChainError(field, 'foo', 'Didn\'t match')
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, boolean>(true)

  const segmentSpec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  type SegmentSpec = TypeHint<typeof segmentSpec>

  expectType<SegmentSpec, {field: boolean}>(true)
})
