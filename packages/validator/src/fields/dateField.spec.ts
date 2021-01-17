import { expectType } from '@spec-validator/test-utils/expectType'
import { TypeHint } from '../core'
import $ from './segmentField'
import dateField from './dateField'
import {
  testValidateSegmentChainError,
  testValidateSegmentChainOK,
} from './TestUtils.test'
import { testValidateSpecOk, testValidateSpecError } from '../TestUtils.test'


describe('date-time', () => {
  const field = dateField('date-time')

  test('field', () => {
    testValidateSpecOk(field, '1995-12-17T03:24:00Z', new Date('1995-12-17T03:24:00Z'), '1995-12-17T03:24:00.000Z')
    testValidateSpecError(field, 42, 'Not a string')
    testValidateSpecError(field, 'foo', 'Invalid date-time string')
  })

  test('segmentChain', () => {
    testValidateSegmentChainOK(field,
      '1995-12-17T03:24:00Z',
      new Date('1995-12-17T03:24:00Z'),
      '1995-12-17T03:24:00.000Z'
    )
    testValidateSegmentChainError(field, 'foo', 'Didn\'t match')
  })

  test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, Date>(true)

  const segmentSpec = $
    ._('/')
    ._('field', field)
    ._('/suffix')

  type SegmentSpec = TypeHint<typeof segmentSpec>

  expectType<SegmentSpec, {field: Date}>(true)
  })

})

describe('date', () => {
  const field = dateField('date')

  it('deserializes into the a given date at midnight', () => {
    testValidateSpecOk(field, '1995-12-17', new Date('1995-12-17T00:00:00Z'), '1995-12-17')
  })

})

describe('time', () => {
  const field = dateField('time')

  it('deserializes into the first epoch Date with a given time', () => {
    testValidateSpecOk(field, '03:24:00Z', new Date('1970-01-01T03:24:00.000Z'), '03:24:00.000Z')
  })

})

